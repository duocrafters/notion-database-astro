import { add } from './index.js';
import { test, expect } from 'vitest';

test('add', () => {
  expect(add()).toBe(2);
});
