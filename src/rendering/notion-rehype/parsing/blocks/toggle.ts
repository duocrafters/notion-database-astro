import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseToggle: NodeParser = ({ node, parse }) => {
  if (node.block.type !== 'toggle') return null;

  return {
    element: h(
      'details',
      { class: 'collapsible' },
      h(
        'summary',
        { class: 'collapsible-summary' },
        node.block.toggle.rich_text.map(parseRichText),
      ),
      h('div', { class: 'collapsible-content' }, parse(node.children)),
    ),
  };
};
