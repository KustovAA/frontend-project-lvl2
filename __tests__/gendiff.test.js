import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

describe('compare objects json', () => {
  const filepath1 = '__fixtures__/file1.json';
  const filepath2 = '__fixtures__/file2.json';

  test('plain', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-plain.txt'), 'utf-8');
    const actual = genDiff(filepath1, filepath2, 'plain');
    expect(actual).toBe(expected);
  });

  test('stylish', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-stylish.txt'), 'utf-8');
    const actual = genDiff(filepath1, filepath2, 'stylish');
    expect(actual).toBe(expected);
  });

  test('json', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-json.txt'), 'utf-8');
    const actual = genDiff(filepath1, filepath2, 'json');
    expect(actual).toBe(expected);
  });
});

describe('compare objects yaml', () => {
  const filepath1 = '__fixtures__/file1.yml';
  const filepath2 = '__fixtures__/file2.yml';

  test('stylish', async () => {
    const expected = await fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-stylish.txt'), 'utf-8');
    const actual = await genDiff(filepath1, filepath2, 'stylish');
    expect(actual).toBe(expected);
  });

  test('plain', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-plain.txt'), 'utf-8');
    const actual = genDiff(filepath1, filepath2, 'plain');
    expect(actual).toBe(expected);
  });

  test('json', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), '__fixtures__/result-json.txt'), 'utf-8');
    const actual = genDiff(filepath1, filepath2, 'json');
    expect(actual).toBe(expected);
  });
});
