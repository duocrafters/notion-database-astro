import type { BlocksTreeNode } from '../../../../types/BlocksTreeNode.js';
import type { NodeParserOutput } from './NodeParserOutput.js';
import type { Element } from 'hast';

export type NodeParser = ({
  node,
  followingNodes,
  parse,
}: {
  node: BlocksTreeNode;
  followingNodes: BlocksTreeNode[];
  parse: (nodes: BlocksTreeNode[]) => Element[];
}) => NodeParserOutput;
