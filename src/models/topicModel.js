import { connectToDatabase } from '@/lib/mongodb';

const COLLECTION = 'studyTopics';

function normalizeLegacyNoteText(topic) {
    const rawNotes = typeof topic?.notes === 'string' ? topic.notes : topic?.description || '';
    const codeBlocks = Array.isArray(topic?.codes) && topic.codes.length
        ? topic.codes
            .map((code) => {
                const label = code?.label?.trim() || 'Code';
                const language = code?.language || 'javascript';
                const snippet = code?.snippet || '';
                return `## ${label}\n\n\`\`\`${language}\n${snippet}\n\`\`\``;
            })
            .join('\n\n')
        : '';

    const notesText = (rawNotes || '').trim();
    return notesText || codeBlocks ? `${notesText}${notesText && codeBlocks ? '\n\n' : ''}${codeBlocks}`.trim() : '';
}

function normalizeTopic(topic) {
    if (!topic) return null;

    const notes = normalizeLegacyNoteText(topic);
    return {
        ...topic,
        _id: topic._id?.toString ? topic._id.toString() : topic._id,
        ownerId: topic.ownerId?.toString ? topic.ownerId.toString() : topic.ownerId,
        title: topic.title?.trim() || 'Untitled topic',
        category: topic.category?.trim() || 'General',
        notes,
        description: notes,
        codes: [],
    };
}

function userFilter(userId) {
    // Every topic is private to exactly one authenticated user.
    // Never include legacy/unowned records in normal reads: otherwise one
    // user's topics could leak into another user's workspace.
    return { ownerId: userId };
}

/**
 * One-time migration for topics created before authentication existed.
 * If the dataset is still completely unowned, assign it to the currently
 * authenticated user. Once ownership exists, this function does nothing.
 * This prevents a newly registered user from claiming an existing user's data.
 */
export async function migrateLegacyTopicsToUser(userId) {
    if (!userId) return { matchedCount: 0, modifiedCount: 0 };

    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION);

    // Only migrate when there are no owned topics yet. This makes the
    // migration safe to run on every login.
    const ownedTopic = await collection.findOne({
        ownerId: { $exists: true, $nin: [null, ''] },
    }, { projection: { _id: 1 } });

    if (ownedTopic) {
        return { matchedCount: 0, modifiedCount: 0 };
    }

    const result = await collection.updateMany(
        {
            $or: [
                { ownerId: { $exists: false } },
                { ownerId: null },
                { ownerId: '' },
            ],
        },
        {
            $set: {
                ownerId: userId,
                updatedAt: new Date(),
            },
        },
    );

    return {
        matchedCount: result.matchedCount || 0,
        modifiedCount: result.modifiedCount || 0,
    };
}

export async function getTopics(userId) {
    const { db } = await connectToDatabase();
    const topics = await db
        .collection(COLLECTION)
        .find(userFilter(userId))
        .sort({ category: 1, updatedAt: -1 })
        .toArray();
    return topics.map(normalizeTopic);
}

export async function getTopicById(id, userId) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    if (!ObjectId.isValid(id)) return null;

    const topic = await db.collection(COLLECTION).findOne({
        _id: new ObjectId(id),
        ...userFilter(userId),
    });
    return normalizeTopic(topic);
}

export async function createTopic(topic, userId) {
    const now = new Date();
    const notes = (typeof topic.notes === 'string' ? topic.notes : topic.description || '').trim();
    const newTopic = {
        ...topic,
        ownerId: userId,
        title: topic.title?.trim() || 'Untitled topic',
        category: topic.category?.trim() || 'General',
        notes,
        description: notes,
        codes: [],
        createdAt: now,
        updatedAt: now,
    };

    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTION).insertOne(newTopic);
    return normalizeTopic({ _id: result.insertedId, ...newTopic });
}

export async function updateTopic(id, update, userId) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    if (!ObjectId.isValid(id)) return null;

    const notes = (typeof update.notes === 'string' ? update.notes : update.description || '').trim();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id), ...userFilter(userId) },
        {
            $set: {
                ownerId: userId,
                title: update.title?.trim() || 'Untitled topic',
                category: update.category?.trim() || 'General',
                notes,
                description: notes,
                codes: [],
                updatedAt: new Date(),
            },
        },
        { returnDocument: 'after' }
    );
    return normalizeTopic(result.value);
}

export async function deleteTopic(id, userId) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    if (!ObjectId.isValid(id)) return { deletedCount: 0 };
    return db.collection(COLLECTION).deleteOne({
        _id: new ObjectId(id),
        ...userFilter(userId),
    });
}
