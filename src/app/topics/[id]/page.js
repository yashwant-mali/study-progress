import TopicDetailClient from '@/components/TopicDetailClient';
import { getTopicById } from '@/controllers/topicController';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TopicDetailPage({ params }) {
    const resolvedParams = await params;
    const topicId = resolvedParams?.id ? String(resolvedParams.id) : '';
    let topic = null;
    let serverError = '';

    if (!topicId) {
        serverError = 'Topic ID is required';
    } else {
        try {
            topic = await getTopicById(topicId);
        } catch (error) {
            serverError = error.message || 'Could not load topic';
        }
    }

    return (
        <TopicDetailClient
            initialTopic={topic}
            topicId={topicId}
            serverError={serverError}
        />
    );
}
