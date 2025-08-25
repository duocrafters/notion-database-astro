import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';
import { takeWhile } from '../../utils/takeWhile.js';

export const parseBulletedListItem: NodeParser = ({
  node,
  parse,
  followingNodes,
}) => {
  const { taken: listItemsNodes, excluded: followingRemainingNodes } =
    takeWhile([node, ...followingNodes], (node) => {
      return !!node && node.block.type === 'bulleted_list_item';
    });

  const listEl = h(
    'ul',
    { class: 'list bulleted-list' },
    listItemsNodes.map((node) => {
      if (node.block.type !== 'bulleted_list_item') return null;

      return h(
        'li',
        { class: 'list-item bullet-item' },
        node.block.bulleted_list_item.rich_text.map(parseRichText),
        parse(node.children),
      );
    }),
  );

  return {
    element: listEl,
    followingRemainingNodes,
  };
};
