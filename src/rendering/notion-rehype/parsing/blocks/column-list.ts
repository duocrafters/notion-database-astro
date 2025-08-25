import { h } from 'hastscript';
import type { NodeParser } from '../types/NodeParser.js';

export const parseColumnList: NodeParser = ({ node, parse }) => {
  if (node.block.type !== 'column_list') return null;

  return { element: h('div', { class: 'columns' }, parse(node.children)) };
};
