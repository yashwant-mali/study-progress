export function parseNotesBlocks(content = '') {
    const text = typeof content === 'string' ? content : '';
    if (!text.trim()) {
        return [];
    }

    const blocks = [];
    const segments = text.split(/```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g);

    if (segments.length === 1) {
        return [{ type: 'theory', content: text.trim() }];
    }

    let index = 0;
    while (index < segments.length) {
        const before = segments[index];
        const language = segments[index + 1] || '';
        const code = segments[index + 2] || '';

        if (before && before.trim()) {
            blocks.push({ type: 'theory', content: before.trim() });
        }

        if (code && code.trim()) {
            blocks.push({ type: 'code', language: language.trim() || 'text', content: code.trim() });
        }

        index += 3;
    }

    return blocks.filter((block) => block.content && block.content.trim());
}

export function renderNotesMarkdown(content = '') {
    const blocks = parseNotesBlocks(content);
    return blocks.map((block) => {
        if (block.type === 'code') {
            return `\n\n\`\`\`${block.language || 'text'}\n${block.content}\n\`\`\`\n\n`;
        }
        return `\n${block.content}\n`;
    }).join('').trim();
}
