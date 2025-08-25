import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';
import { takeWhile } from '../../utils/takeWhile.js';

export const parseHeading1: NodeParser = ({ node, parse, followingNodes }) => {
  const { taken: sectionItemsNodes, excluded: followingRemainingNodes } =
    takeWhile(followingNodes, (node) => {
      return !!node && node.block.type !== 'heading_1';
    });

  if (node.block.type !== 'heading_1') return null;

  return {
    element: h(
      'section',
      { class: 'article-section' },
      h(
        'h2',
        { class: 'title1' },
        node.block.heading_1.rich_text.map(parseRichText),
      ),
      parse(sectionItemsNodes),
    ),
    followingRemainingNodes,
  };
};
