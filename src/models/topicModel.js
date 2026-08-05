import { connectToDatabase } from '@/lib/mongodb';

const COLLECTION = 'studyTopics';

function serializeTopic(topic) {
    if (!topic) return null;
    return {
        ...topic,
        _id: topic._id?.toString ? topic._id.toString() : topic._id,
    };
}

export async function getTopics() {
    const { db } = await connectToDatabase();
    const topics = await db
        .collection(COLLECTION)
        .find({})
        .sort({ category: 1, updatedAt: -1 })
        .toArray();
    return topics.map(serializeTopic);
}

export async function getTopicById(id) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    const topic = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return serializeTopic(topic);
}

export async function createTopic(topic) {
    const now = new Date();
    const newTopic = {
        ...topic,
        category: topic.category?.trim() || 'General',
        description: topic.description?.trim() || '',
        codes: Array.isArray(topic.codes)
            ? topic.codes.map((code) => ({
                label: code.label?.trim() || 'Solution',
                language: code.language || 'JavaScript',
                snippet: code.snippet || '',
            }))
            : [],
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
    const result = await db.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                title: update.title,
                category: update.category?.trim() || 'General',
                description: update.description,
                codes: Array.isArray(update.codes)
                    ? update.codes.map((code) => ({
                        label: code.label?.trim() || 'Solution',
                        language: code.language || 'JavaScript',
                        snippet: code.snippet || '',
                    }))
                    : [],
                updatedAt: new Date(),
            },
        },
        { returnDocument: 'after' }
    );
    return serializeTopic(result.value);
}

export async function deleteTopic(id) {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
