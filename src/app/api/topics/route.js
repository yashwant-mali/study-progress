import { NextResponse } from 'next/server';
import { listTopics, addTopic, editTopic, removeTopic } from '@/controllers/topicController';
import { getAuthUserFromRequest } from '@/lib/auth';

async function jsonError(error, status = 500) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
}

async function getUser(request) {
    const session = await getAuthUserFromRequest(request);
    return session?.sub || null;
}

export async function GET(request) {
    try {
        const userId = await getUser(request);
        const topics = await listTopics(userId);
        return NextResponse.json(topics);
    } catch (error) {
        return jsonError(error, error.status || 500);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const topic = await addTopic(body, await getUser(request));
        return NextResponse.json(topic, { status: 201 });
    } catch (error) {
        return jsonError(error, error.status || (error.message?.includes('required') ? 400 : 500));
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const topic = await editTopic(body.id, body, await getUser(request));
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.status || (error.message?.includes('required') ? 400 : 500));
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        await removeTopic(body.id, await getUser(request));
        return NextResponse.json({ success: true });
    } catch (error) {
        return jsonError(error, error.status || 500);
    }
}
