import { h } from 'hastscript';
import type { NodeParser } from '../types/NodeParser.js';

export const parseVideo: NodeParser = ({ node }) => {
  if (node.block.type !== 'video') return null;
  if (node.block.video.type !== 'external') return null;

  const url = new URL(node.block.video.external.url);
  const videoId = url.searchParams.get('v');

  return {
    element: h('lite-youtube', { videoid: videoId }),
  };
};
