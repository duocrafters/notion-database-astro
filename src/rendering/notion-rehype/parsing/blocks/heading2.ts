import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseHeading2: NodeParser = ({ node }) => {
  if (node.block.type !== 'heading_2') return null;

  return {
    element: h(
      'h3',
      { class: 'title2' },
      node.block.heading_2.rich_text.map(parseRichText),
    ),
  };
};
