import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseQuote: NodeParser = ({ node }) => {
  if (node.block.type !== 'quote') return null;

  return {
    element: h(
      'blockquote',
      { class: 'quote' },
      node.block.quote.rich_text.map(parseRichText),
    ),
  };
};
