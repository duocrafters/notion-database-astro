import { type Plugin } from 'unified';
import type { BlocksTreeRoot } from '../../types/BlocksTreeRoot.js';
import { parseNodesTree } from './parsing/parser.js';
import type { Root } from 'hast';

/**
 * Documentation of unified is very incomplete, so I have done my best to create this plugin. But it is actually a well known tool that is even used to render markdown files into HTML by Astro.
 *
 * Basically, it converts a notion blocks tree (fetched from the API) into an hast tree.
 * An hast tree is a representation of the HTML/DOM that we can manipulate and transform very easily using other unified plugins.
 */
const notionRehype: Plugin<[], Root> = function () {
  this.parser = (document, file) => {
    const tree = file.data.tree as BlocksTreeRoot;

    try {
      return parseNodesTree(tree);
    } catch (e) {
      const msg = 'an error appened while parsing notion blocks';
      console.error(msg, e);
      throw new Error(msg);
    }
  };
};

export default notionRehype;
