import { h } from 'hastscript';
import type { NodeParser } from '../types/NodeParser.js';
import { parseRichText } from './rich-text.js';

export const parseTable: NodeParser = ({ node }) => {
  if (node.block.type !== 'table') return null;

  const hasColumnHeader = node.block.table.has_column_header;
  const hasRowHeader = node.block.table.has_row_header;

  return {
    element: h(
      'table',
      { class: 'table' },
      node.children.map((rowNode, rowNodeIndex) => {
        if (rowNode.block.type !== 'table_row') return null;

        return h(
          'tr',
          { class: 'table-row' },
          rowNode.block.table_row.cells.map((cell, cellIndex) => {
            const isColHeader = rowNodeIndex === 0 && hasColumnHeader;
            const isRowHeader = cellIndex === 0 && hasRowHeader;
            const isHeader = isColHeader || isRowHeader;

            return h(isHeader ? 'th' : 'td', cell.map(parseRichText));
          }),
        );
      }),
    ),
  };
};
