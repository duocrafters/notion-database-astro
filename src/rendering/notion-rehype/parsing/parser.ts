import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import type { BlocksTreeRoot } from '../../../types/BlocksTreeRoot.js';
import type { BlocksTreeNode } from '../../../types/BlocksTreeNode.js';
import { parseBulletedListItem } from './blocks/bulleted-list-item.js';
import { parseCallout } from './blocks/callout.js';
import { parseCode } from './blocks/code.js';
import { parseColumn } from './blocks/column.js';
import { parseColumnList } from './blocks/column-list.js';
import { parseDivider } from './blocks/divider.js';
import { parseHeading1 } from './blocks/heading1.js';
import { parseHeading2 } from './blocks/heading2.js';
import { parseHeading3 } from './blocks/heading3.js';
import { parseImage } from './blocks/image.js';
import { parseNumberedListItem } from './blocks/numbered-list-item.js';
import { parseParagraph } from './blocks/paragraph.js';
import { parseQuote } from './blocks/quote.js';
import { parseTable } from './blocks/table.js';
import { parseToDoItem } from './blocks/todo.js';
import { parseToggle } from './blocks/toggle.js';
import { parseVideo } from './blocks/video.js';
import type { Root, Element } from 'hast';
import { h } from 'hastscript';
import type { NodeParser } from './types/NodeParser.js';

const parsersByBlockType: Partial<
  Record<BlockObjectResponse['type'], NodeParser>
> = {
  paragraph: parseParagraph,
  heading_1: parseHeading1,
  heading_2: parseHeading2,
  heading_3: parseHeading3,
  table: parseTable,
  to_do: parseToDoItem,
  quote: parseQuote,
  divider: parseDivider,
  callout: parseCallout,
  image: parseImage,
  bulleted_list_item: parseBulletedListItem,
  toggle: parseToggle,
  numbered_list_item: parseNumberedListItem,
  code: parseCode,
  column_list: parseColumnList,
  column: parseColumn,
  video: parseVideo,
};

export function parseNodes(nodes: BlocksTreeNode[]): Element[] {
  let nodesToParse = [...nodes];
  const parsedElements: Element[] = [];

  while (nodesToParse.length > 0) {
    const node = nodesToParse.shift();

    if (!node) {
      throw new Error('encountered an unsupported element while parsing nodes');
    }

    const nodeParser = parsersByBlockType[node.block.type];
    if (!nodeParser) {
      throw new Error('encountered an unsupported element while parsing nodes');
    }

    const parseOutput = nodeParser({
      node,
      parse: parseNodes,
      followingNodes: nodesToParse,
    });
    if (!parseOutput) {
      throw new Error('an error occured while parsing the node');
    }

    parsedElements.push(parseOutput.element);
    nodesToParse = parseOutput.followingRemainingNodes || nodesToParse;
  }

  return parsedElements;
}

export function parseNodesTree(treeRoot: BlocksTreeRoot): Root {
  return h(null, parseNodes(treeRoot.children));
}
