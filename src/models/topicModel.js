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
                return `## ${label}\n\n\`\`\`\${language}\n${snippet}\n\`\`\``;
            })
            .join('\n\n')
        : '';

    const notesText = (rawNotes || '').trim();
    return notesText || codeBlocks ? `${notesText}${notesText && codeBlocks ? '\n\n' : ''}${codeBlocks}`.trim() : '';
}

function normalizeTopic(topic) {
    if (!topic) return null;

    const notes = normalizeLegacyNoteText(topic);
    const normalized = {
        ...topic,
        _id: topic._id?.toString ? topic._id.toString() : topic._id,
        title: topic.title?.trim() || 'Untitled topic',
        category: topic.category?.trim() || 'General',
        notes,
        description: notes,
        codes: [],
    };

    return normalized;
}

export async function getTopics() {
    const { db } = await connectToDatabase();
    const topics = await db
        .collection(COLLECTION)
        .find({})
        .sort({ category: 1, updatedAt: -1 })
        .toArray();
    return topics.map(normalizeTopic);
}

export async function getTopicById(id) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    const topic = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return normalizeTopic(topic);
}

export async function createTopic(topic) {
    const now = new Date();
    const notes = (typeof topic.notes === 'string' ? topic.notes : topic.description || '').trim();
    const newTopic = {
        ...topic,
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
    return { _id: result.insertedId.toString(), ...newTopic };
}

export async function updateTopic(id, update) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    const notes = (typeof update.notes === 'string' ? update.notes : update.description || '').trim();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
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

export async function deleteTopic(id) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
