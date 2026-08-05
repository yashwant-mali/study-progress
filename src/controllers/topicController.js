import { getTopics, getTopicById as fetchTopicById, createTopic, updateTopic, deleteTopic } from '@/models/topicModel';

export async function listTopics() {
    return getTopics();
}

export async function getTopicById(id) {
    if (!id) {
        throw new Error('Topic ID is required');
    }

    const topic = await fetchTopicById(id);
    if (!topic) {
        throw new Error('Topic not found');
    }
    return topic;
}

export async function addTopic(topic) {
    if (!topic?.title || typeof topic.title !== 'string') {
        throw new Error('Topic title is required');
    }

    return createTopic({
        title: topic.title,
        category: topic.category || 'General',
        description: topic.description || '',
        codes: Array.isArray(topic.codes) ? topic.codes : [],
    });
}

export async function editTopic(id, update) {
    if (!id) {
        throw new Error('Topic ID is required');
    }

    return updateTopic(id, {
        title: update.title,
        category: update.category || 'General',
        description: update.description,
        codes: update.codes,
    });
}

export async function removeTopic(id) {
    if (!id) {
        throw new Error('Topic ID is required');
    }

    return deleteTopic(id);
}
