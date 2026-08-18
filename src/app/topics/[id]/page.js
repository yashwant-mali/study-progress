import TopicDetailClient from '@/components/TopicDetailClient';
import { getTopicById } from '@/controllers/topicController';
import { cookies } from 'next/headers';
import { getSessionCookieName, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TopicDetailPage({ params }) {
    const resolvedParams = await params;
    const topicId = resolvedParams?.id ? String(resolvedParams.id) : '';
    let topic = null;
    let serverError = '';

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(getSessionCookieName())?.value;
        const session = verifyToken(token);

        if (!session?.sub) {
            serverError = 'Authentication required';
        } else if (!topicId) {
            serverError = 'Topic ID is required';
        } else {
            topic = await getTopicById(topicId, session.sub);
        }
    } catch (error) {
        serverError = error.message || 'Could not load topic';
    }

    return (
        <TopicDetailClient
            initialTopic={topic}
            topicId={topicId}
            serverError={serverError}
        />
    );
}
