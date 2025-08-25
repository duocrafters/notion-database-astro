import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseParagraph: NodeParser = ({ node }) => {
  if (node.block.type !== 'paragraph') return null;

  return {
    element: h(
      'p',
      { class: 'paragraph' },
      node.block.paragraph.rich_text.map(parseRichText),
    ),
  };
};
