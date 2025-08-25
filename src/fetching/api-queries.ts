import {
  collectPaginatedAPI,
  isFullBlock,
  isFullPage,
  type Client,
} from '@notionhq/client';
import type { BlocksTreeNode } from '../types/BlocksTreeNode.js';
import type { BlocksTreeRoot } from '../types/BlocksTreeRoot.js';
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints.js';

export interface DatabaseQueryParams {
  filter: QueryDatabaseParameters['filter'];
}

export function buildApiQueries(client: Client) {
  async function fetchDatabaseItems(
    databaseId: string,
    { filter }: DatabaseQueryParams,
  ) {
    return await collectPaginatedAPI(client.databases.query, {
      database_id: databaseId,

      filter,
    });
  }

  async function fetchDatabasePages(
    databaseId: string,
    { filter }: DatabaseQueryParams,
  ): Promise<PageObjectResponse[]> {
    const databaseItems = await fetchDatabaseItems(databaseId, { filter });

    // Notion database can contain elements that are not pages (they are just row in the database), we need to skip these elements
    return databaseItems.filter(isFullPage);
  }

  async function fetchPageBlocks(pageId: string): Promise<BlocksTreeNode[]> {
    const blocks = await collectPaginatedAPI(client.blocks.children.list, {
      block_id: pageId,
    });

    const fullBlocks = blocks.filter(isFullBlock);

    return await Promise.all(
      fullBlocks.map(async (block) => {
        return {
          type: 'block',
          block,
          children: block.has_children ? await fetchPageBlocks(block.id) : [],
        };
      }),
    );
  }

  async function fetchPageContentAsTree(
    pageId: string,
  ): Promise<BlocksTreeRoot> {
    return {
      type: 'root',
      children: await fetchPageBlocks(pageId),
    };
  }

  return {
    fetchDatabasePages,
    fetchPageContentAsTree,
  };
}
