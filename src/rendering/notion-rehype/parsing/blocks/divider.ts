import { h } from 'hastscript';
import type { NodeParser } from '../types/NodeParser.js';

export const parseDivider: NodeParser = () => ({
  element: h('hr', { class: 'divider' }),
});
