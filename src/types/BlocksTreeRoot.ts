import type { BlocksTreeNode } from './BlocksTreeNode.js';

export interface BlocksTreeRoot {
  type: 'root';
  children: BlocksTreeNode[];
}
