import { NextResponse } from 'next/server';
import { getTopicById, editTopic, removeTopic } from '@/controllers/topicController';

async function jsonError(error, status = 500) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
}

function getRouteId(params) {
    return params?.id ? String(params.id) : null;
}

export async function GET(request, context) {
    try {
        const params = await context.params;
        const id = getRouteId(params);
        const topic = await getTopicById(id);
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.message.includes('required') ? 400 : 404);
    }
}

export async function PATCH(request, context) {
    try {
        const params = await context.params;
        const id = getRouteId(params);
        const body = await request.json();
        const topic = await editTopic(id, body);
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.message.includes('required') ? 400 : 500);
    }
}

export async function DELETE(request, context) {
    try {
        const params = await context.params;
        const id = getRouteId(params);
        await removeTopic(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return jsonError(error);
    }
}
