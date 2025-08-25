import { Client } from '@notionhq/client';
import type { Loader, LoaderContext } from 'astro/loaders';
import {
  buildApiQueries,
  type DatabaseQueryParams,
} from './fetching/api-queries.js';
import {
  initPageContentProcessor,
  renderPageContent,
} from './rendering/page-content-render.js';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { generateDatabaseSchema } from '@duocrafters/notion-database-zod';

interface NotionLoaderOptions {
  databaseId: string;
  databaseQuery: DatabaseQueryParams;
  auth: string;
  filter?: (page: PageObjectResponse) => boolean;
}

export function notionLoader(options: NotionLoaderOptions): Loader {
  const { databaseId, databaseQuery, filter } = options;

  const notionClient = new Client(options);
  const pageContentProcessor = initPageContentProcessor();

  const { fetchPageContentAsTree, fetchDatabasePages } =
    buildApiQueries(notionClient);

  async function loadContent(loaderContext: LoaderContext) {
    const allPages = await fetchDatabasePages(databaseId, databaseQuery);
    const pages = allPages.filter(filter ? filter : () => true);

    for await (const page of pages) {
      await loadPage(loaderContext, page);
    }

    await cleanObsoletePages(loaderContext, pages);
  }

  async function loadPage(
    loaderContext: LoaderContext,
    page: PageObjectResponse,
  ) {
    const { store, generateDigest, parseData, logger } = loaderContext;
    const pageDigest = generateDigest(page.last_edited_time);

    logger.info(`fetch and render page ${page.id}`);
    const renderedPageContent = await fetchAndRenderPageContent(page.id);

    const validatedPage = await parseData({
      id: page.id,
      data: page,
    });

    store.set({
      id: validatedPage.id,
      data: validatedPage,
      digest: pageDigest,
      rendered: {
        html: renderedPageContent,
      },
    });
  }

  async function cleanObsoletePages(
    loaderContext: LoaderContext,
    fetchedPages: PageObjectResponse[],
  ) {
    const { store, logger } = loaderContext;

    const localPagesIds: string[] = store.keys();
    const remotePageIds: string[] = fetchedPages.map((page) => page.id);

    const pageIdsToRemove = localPagesIds.filter(
      (pageId) => !remotePageIds.includes(pageId),
    );

    pageIdsToRemove.forEach((pageId) => {
      logger.info(`remove obsolete page ${pageId}`);
      return store.delete(pageId);
    });
  }

  async function fetchAndRenderPageContent(pageId: string) {
    const blocksTree = await fetchPageContentAsTree(pageId);

    return await renderPageContent(pageContentProcessor, blocksTree);
  }

  async function pageSchema() {
    return await generateDatabaseSchema(databaseId, {
      auth: options.auth,
    });
  }

  return {
    name: 'notion-loader',
    load: loadContent,
    schema: pageSchema,
  };
}
