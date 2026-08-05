import { NextResponse } from 'next/server';
import { listTopics, addTopic, editTopic, removeTopic } from '@/controllers/topicController';

async function jsonError(error, status = 500) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
}

export async function GET() {
    try {
        const topics = await listTopics();
        return NextResponse.json(topics);
    } catch (error) {
        return jsonError(error);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const topic = await addTopic(body);
        return NextResponse.json(topic, { status: 201 });
    } catch (error) {
        return jsonError(error, error.message.includes('required') ? 400 : 500);
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const topic = await editTopic(body.id, body);
        return NextResponse.json(topic);
    } catch (error) {
        return jsonError(error, error.message.includes('required') ? 400 : 500);
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        await removeTopic(body.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return jsonError(error);
    }
}
