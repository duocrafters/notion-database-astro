import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';
import { takeWhile } from '../../utils/takeWhile.js';

export const parseNumberedListItem: NodeParser = ({
  node,
  parse,
  followingNodes,
}) => {
  const { taken: listItemsNodes, excluded: followingRemainingNodes } =
    takeWhile([node, ...followingNodes], (node) => {
      return !!node && node.block.type === 'numbered_list_item';
    });

  const listEl = h(
    'ol',
    { class: 'list numbered-list' },
    listItemsNodes.map((node) => {
      if (node.block.type !== 'numbered_list_item') return null;

      return h(
        'li',
        { class: 'list-item numbered-item' },
        node.block.numbered_list_item.rich_text.map(parseRichText),
        parse(node.children),
      );
    }),
  );

  return {
    element: listEl,
    followingRemainingNodes,
  };
};
