import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNotesBlocks } from './notes.js';

test('parses theory and code blocks while preserving indentation', () => {
    const content = [
        '## Closures',
        '',
        'A closure remembers variables from its lexical scope.',
        '',
        '```javascript',
        'function outer() {',
        '  let count = 0;',
        '',
        '  return function inner() {',
        '    count++;',
        '    console.log(count);',
        '  };',
        '}',
        '```',
        '',
        'The inner function still has access to count.',
    ].join('\n');

    const blocks = parseNotesBlocks(content);

    assert.equal(blocks.length, 3);
    assert.equal(blocks[0].type, 'theory');
    assert.match(blocks[0].content, /Closures/);
    assert.equal(blocks[1].type, 'code');
    assert.equal(blocks[1].language, 'javascript');
    assert.match(blocks[1].content, /function outer\(\)/);
    assert.match(blocks[1].content, /    count\+\+;/);
    assert.equal(blocks[2].type, 'theory');
    assert.match(blocks[2].content, /The inner function/);
});

test('keeps plain text as theory when no code blocks exist', () => {
    const blocks = parseNotesBlocks('Closure means a function keeps access to outer scope.');

    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].type, 'theory');
    assert.match(blocks[0].content, /Closure means/);
});
