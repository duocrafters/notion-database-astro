import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import { takeWhile } from '../../utils/takeWhile.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseToDoItem: NodeParser = ({ node, parse, followingNodes }) => {
  const { taken: listItemsNodes, excluded: followingRemainingNodes } =
    takeWhile([node, ...followingNodes], (node) => {
      return !!node && node.block.type === 'to_do';
    });

  const listEl = h(
    'ul',
    { class: 'list todo-list' },
    listItemsNodes.map((node) => {
      if (node.block.type !== 'to_do') return null;

      return h(
        'li',
        { class: 'list-item' },
        h(
          'div',
          { class: 'todo-item' },
          h('input', { type: 'checkbox', disabled: true, id: node.block.id }),
          h(
            'label',
            { for: node.block.id },
            node.block.to_do.rich_text.map(parseRichText),
          ),
        ),
        parse(node.children),
      );
    }),
  );

  return {
    element: listEl,
    followingRemainingNodes,
  };
};
