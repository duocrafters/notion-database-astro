import type { BlocksTreeNode } from '../../../../types/BlocksTreeNode.js';
import type { Element } from 'hast';

export type NodeParserOutput = {
  element: Element;
  followingRemainingNodes?: BlocksTreeNode[];
} | null;
