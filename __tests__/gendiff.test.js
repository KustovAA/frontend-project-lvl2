import { test, expect } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

test('compare plain objects json', async () => {
  const expected = await fs.readFile(path.resolve(process.cwd(), '__fixtures__/plain-objects.fixture.txt'), 'utf-8');
  const filepath1 = '__fixtures__/file1.json';
  const filepath2 = '__fixtures__/file2.json';
  const actual = await genDiff(filepath1, filepath2);
  expect(actual).toBe(expected);
});

test('compare plain objects yaml', async () => {
  const expected = await fs.readFile(path.resolve(process.cwd(), '__fixtures__/plain-objects.fixture.txt'), 'utf-8');
  const filepath1 = '__fixtures__/file1.yml';
  const filepath2 = '__fixtures__/file2.yml';
  const actual = await genDiff(filepath1, filepath2);
  expect(actual).toBe(expected);
});
