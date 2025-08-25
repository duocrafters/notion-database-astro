import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseCallout: NodeParser = ({ node, parse }) => {
  if (node.block.type !== 'callout') return null;

  const icon =
    node.block.callout.icon?.type === 'emoji'
      ? node.block.callout.icon.emoji
      : '';

  return {
    element: h('aside', { class: 'callout' }, [
      h('span', { class: 'callout-icon' }, icon),
      h(
        'div',
        { class: 'callout-content' },
        node.block.callout.rich_text.map(parseRichText),
        parse(node.children),
      ),
    ]),
  };
};
