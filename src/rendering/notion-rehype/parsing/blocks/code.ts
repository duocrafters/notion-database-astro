import { h } from 'hastscript';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseCode: NodeParser = ({ node }) => {
  if (node.block.type !== 'code') return null;

  const language = node.block.code.language || 'plaintext';

  return {
    element: h('pre', { class: 'code' }, [
      h(
        'code',
        { class: `language-${language}` },
        node.block.code.rich_text.map(parseRichText),
      ),
    ]),
  };
};
