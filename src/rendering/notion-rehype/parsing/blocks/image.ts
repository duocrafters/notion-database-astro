import { h } from 'hastscript';
import { fileToUrl } from '../../../../schemas/FileObjectSchema.js';
import { parseRichText } from './rich-text.js';
import type { NodeParser } from '../types/NodeParser.js';

export const parseImage: NodeParser = ({ node }) => {
  if (node.block.type !== 'image') return null;

  const imageUrl = fileToUrl(node.block.image);
  const htmlAltText = node.block.image.caption.map((caption) =>
    parseRichText(caption),
  );
  const rawAltText = node.block.image.caption
    .map((item) => item.plain_text)
    .join(' ');

  const figCaptionEl =
    htmlAltText.length > 0
      ? h(
          'div',
          { class: 'figure-caption-back' },
          h('figcaption', { class: 'figure-caption' }, htmlAltText),
        )
      : null;

  return {
    element: h('figure', { class: 'figure' }, [
      h(
        'a',
        { href: imageUrl },
        h('img', {
          src: imageUrl,
          alt: rawAltText,
          class: 'figure-image',
          loading: 'lazy',
        }),
      ),
      figCaptionEl,
    ]),
  };
};
