import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseHeading3: NodeParser = ({ node }) => {
  if (node.block.type !== 'heading_3') return null;

  return {
    element: h(
      'h4',
      { class: 'title3' },
      node.block.heading_3.rich_text.map(parseRichText),
    ),
  };
};
