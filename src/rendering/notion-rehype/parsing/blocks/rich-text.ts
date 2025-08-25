import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { h } from 'hastscript';
import type { Element, Text } from 'hast';

export const parseRichText = (
  richText: RichTextItemResponse,
): Element | Text => {
  if (richText.type === 'text') {
    const { annotations, href } = richText;

    let node: Element | Text = {
      type: 'text',
      value: richText.text.content,
    };

    if (annotations.code) node = h('code', { class: 'inline-code' }, node);
    if (annotations.strikethrough)
      node = h('s', { class: 'text-strikethrough' }, node);
    if (annotations.underline) node = h('u', { class: 'text-underline' }, node);
    if (annotations.italic) node = h('em', { class: 'text-italic' }, node);
    if (annotations.bold) node = h('strong', { class: 'text-bold' }, node);
    if (annotations.color)
      node = h(
        'span',
        { class: `text-${richText.annotations.color.replace('_', '-')}` },
        node,
      );

    if (href)
      node = h(
        'a',
        { href, class: 'link', target: '_blank', rel: 'noopener noreferrer' },
        node,
      );

    return node;
  }

  if (richText.type === 'mention') {
    const mention = richText.mention as unknown as {
      link_mention: { title: string; href: string };
    };
    const { title, href } = mention.link_mention;

    let node: Element | Text = {
      type: 'text',
      value: title,
    };

    if (href)
      node = h(
        'a',
        { href, class: 'link', target: '_blank', rel: 'noopener noreferrer' },
        node,
      );

    return node;
  }

  throw new Error('rich text type not supported');
};
