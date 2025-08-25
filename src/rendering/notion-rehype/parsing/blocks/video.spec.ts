import { describe, it, expect } from 'vitest';
import { parseVideo } from './video.js';

function makeNode(type: string, url?: string) {
  return {
    type: 'block',
    block: {
      type: 'video',
      video: {
        type: type,
        external: url ? { url } : undefined,
      },
    },
    children: [],
  } as any;
}

describe('parseVideo', () => {
  it('returns null if the block type is not video', () => {
    const node = { block: { type: 'paragraph' } } as any;
    expect(
      parseVideo({ node, parse: () => [], followingNodes: [] }),
    ).toBeNull();
  });

  it('returns null if video.type is not external', () => {
    const node = makeNode('file', 'https://example.com/video.mp4');
    expect(
      parseVideo({ node, parse: () => [], followingNodes: [] }),
    ).toBeNull();
  });

  it('returns a lite-youtube element with the correct videoid when URL contains ?v=...', () => {
    const node = makeNode('external', 'https://www.youtube.com/watch?v=abc123');
    const result = parseVideo({ node, parse: () => [], followingNodes: [] });
    expect(result).not.toBeNull();
    expect(result?.element.tagName).toBe('lite-youtube');
    expect((result?.element as any).properties.videoid).toBe('abc123');
  });

  it('returns a lite-youtube element with videoid undefined when URL has no v parameter', () => {
    const node = makeNode('external', 'https://www.youtube.com/embed/xyz');
    const result = parseVideo({ node, parse: () => [], followingNodes: [] });
    expect(result).not.toBeNull();
    expect(result?.element.tagName).toBe('lite-youtube');
    expect((result?.element as any).properties.videoid).toBeUndefined();
  });
});
