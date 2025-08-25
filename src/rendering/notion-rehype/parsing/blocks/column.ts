import { h } from 'hastscript';
import type { NodeParser } from '../types/NodeParser.js';

export const parseColumn: NodeParser = ({ node, parse }) => {
  if (node.block.type !== 'column') return null;

  return { element: h('div', { class: 'column' }, parse(node.children)) };
};
