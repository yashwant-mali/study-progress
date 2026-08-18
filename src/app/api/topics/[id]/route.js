import { NextResponse } from 'next/server';
import { getTopicById, editTopic, removeTopic } from '@/controllers/topicController';
import { getAuthUserFromRequest } from '@/lib/auth';

async function jsonError(error, status = 500) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
}

function getRouteId(params) {
    return params?.id ? String(params.id) : null;
}

async function getUser(request) {
    const session = await getAuthUserFromRequest(request);
    return session?.sub || null;
}

export async function GET(request, context) {
    try {
        const params = await context.params;
        const topic = await getTopicById(getRouteId(params), await getUser(request));
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.status || (error.message === 'Topic not found' ? 404 : 500));
    }
}

export async function PATCH(request, context) {
    try {
        const params = await context.params;
        const body = await request.json();
        const topic = await editTopic(getRouteId(params), body, await getUser(request));
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.status || (error.message?.includes('required') ? 400 : 500));
    }
}

export async function DELETE(request, context) {
    try {
        const params = await context.params;
        await removeTopic(getRouteId(params), await getUser(request));
        return NextResponse.json({ success: true });
    } catch (error) {
        return jsonError(error, error.status || 500);
    }
}
