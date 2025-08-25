import { randomUUID } from 'crypto';
import type { Element, ElementContent, Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import imageType from 'image-type';
import { resolve } from 'path';
import { createWriteStream } from 'fs';

export const downloadImage = async (
  url: string,
  name: string,
  folder: string,
) => {
  const img = await fetch(url);
  const arrayBuffer = await img.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const type = await imageType(buffer);
  const outputFileName = `${name}.${type?.ext ?? 'png'}`;

  const distPath = resolve(folder, outputFileName);

  console.log(`Writing file ${distPath} on disk`);

  createWriteStream(distPath).write(buffer);
  return outputFileName;
};

const distFolder = resolve(
  import.meta.dirname,
  '../../../../../public/images/blogs',
);

const isImgElement = (node: ElementContent) =>
  node.type === 'element' && node.tagName === 'img' && !!node.properties?.src;
const isLinkElement = (node: ElementContent) =>
  node.type === 'element' &&
  node.tagName === 'a' &&
  !!node.properties?.href &&
  !!node.children[0] &&
  isImgElement(node.children[0]);

const isImgOrLinkElement = (node: ElementContent) =>
  isImgElement(node) || isLinkElement(node);

/**
 * This plugin allows taking advantage of the Astro feature to optimize images (remotely or locally). One example of a benefit is the decreasing size of the asset files.
 * But the most important one, and the first reason why this plugin was created, is that Astro will download and handle the remote image files to optimize them.
 * It is extremely useful because Notion gives URLs of pictures that expire in the hour.
 */
const rehypeNotionImages: Plugin<[], Root> = function () {
  return async (tree) => {
    const elements = getElementsByPredicate(tree, isImgOrLinkElement);

    for await (const element of elements) {
      if (isLinkElement(element)) {
        await optimizeElementReferencingImage(element, 'link');
      } else if (isImgElement(element)) {
        await optimizeElementReferencingImage(element, 'image');
      }
    }

    return tree;
  };

  function getElementsByPredicate(
    tree: Root,
    predicate: (element: Element) => boolean,
  ): Element[] {
    const elements: Element[] = [];

    visit(tree, 'element', (el) => {
      if (!predicate(el)) return;
      elements.push(el);
    });

    return elements;
  }

  async function optimizeElementReferencingImage(
    element: Element,
    type: 'image' | 'link',
  ) {
    const srcKey = type === 'image' ? 'src' : 'href';

    const originalSource = element.properties[srcKey] as string;

    console.log('Fetching Image...', originalSource);
    const outputFileName = await downloadImage(
      originalSource,
      randomUUID(),
      distFolder,
    );

    /*const optimizedImage = await getImage({
      src: originalSource,
      inferSize: true,
    });*/

    console.log('End fetching image...', outputFileName);

    if (type === 'image') {
      element.properties = {
        //...optimizedImage.attributes,
        ...element.properties,
        [srcKey]: `/images/blogs/${outputFileName}`,
      };
    }
    //element.properties[srcKey] = optimizedImage.src;
  }
};

export default rehypeNotionImages;
