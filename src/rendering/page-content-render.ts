import type { Root } from 'hast';
import rehypeHighlight from 'rehype-highlight';
import rehypeMermaid from 'rehype-mermaid';
import rehypeStringify from 'rehype-stringify';
import { unified, type Processor } from 'unified';
import { VFile } from 'vfile';
import type { BlocksTreeRoot } from '../types/BlocksTreeRoot.js';
import notionRehype from './notion-rehype/notion-rehype.js';
import rehypeNotionImages from './rehype-notion-images/rehype-notion-images.js';

export function initPageContentProcessor(): Processor<
  Root,
  Root,
  Root,
  Root,
  string
> {
  // @ts-ignore
  return unified()
    .use(notionRehype)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeMermaid, {
      mermaidConfig: {},
    })
    .use(rehypeNotionImages)
    .use(rehypeStringify);
}

export async function renderPageContent(
  processor: Processor<Root, Root, Root, Root, string>,
  blocksTree: BlocksTreeRoot,
): Promise<string> {
  const hastTree = processor.parse(
    new VFile({
      data: {
        tree: blocksTree,
      },
    }),
  );

  const enhancedHastTree = await processor.run(hastTree);

  const html = processor.stringify(enhancedHastTree);

  return html;
}
