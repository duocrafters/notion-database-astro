import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';

export interface BlocksTreeNode {
  type: 'block';
  block: BlockObjectResponse;
  children: BlocksTreeNode[];
}
