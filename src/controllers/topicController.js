import { getTopics, getTopicById as fetchTopicById, createTopic, updateTopic, deleteTopic } from '@/models/topicModel';

function authRequired(userId) {
    if (!userId) {
        const error = new Error('Authentication required');
        error.status = 401;
        throw error;
    }
}

export async function listTopics(userId) {
    authRequired(userId);
    return getTopics(userId);
}

export async function getTopicById(id, userId) {
    authRequired(userId);
    if (!id) throw new Error('Topic ID is required');

    const topic = await fetchTopicById(id, userId);
    if (!topic) throw new Error('Topic not found');
    return topic;
}

export async function addTopic(topic, userId) {
    authRequired(userId);
    if (!topic?.title || typeof topic.title !== 'string') {
        throw new Error('Topic title is required');
    }

    const notes = typeof topic.notes === 'string' ? topic.notes : (typeof topic.description === 'string' ? topic.description : '');

    return createTopic({
        title: topic.title,
        category: topic.category || 'General',
        notes,
        description: notes,
        codes: [],
    }, userId);
}

export async function editTopic(id, update, userId) {
    authRequired(userId);
    if (!id) throw new Error('Topic ID is required');

    const notes = typeof update.notes === 'string' ? update.notes : (typeof update.description === 'string' ? update.description : '');

    const topic = await updateTopic(id, {
        title: update.title,
        category: update.category || 'General',
        notes,
        description: notes,
        codes: [],
    }, userId);

    if (!topic) throw new Error('Topic not found');
    return topic;
}

export async function removeTopic(id, userId) {
    authRequired(userId);
    if (!id) throw new Error('Topic ID is required');

    const result = await deleteTopic(id, userId);
    if (!result.deletedCount) throw new Error('Topic not found');
    return result;
}
