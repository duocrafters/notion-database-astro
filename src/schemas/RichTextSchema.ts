import type { RichText } from '@duocrafters/notion-database-zod';

// TODO: Move it somewhere else
export function richTextToPlainText(richTexts: RichText[]): string {
  if (!richTexts) {
    return '';
  }
  return richTexts.map((richText) => richText.plain_text).join('');
}
