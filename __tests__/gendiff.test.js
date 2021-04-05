import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../index.js';

describe.each(['json', 'yml'])('compare objects %s', (ext) => {
  const filepath1 = path.join('__fixtures__', `file1.${ext}`);
  const filepath2 = path.join('__fixtures__', `file2.${ext}`);

  test.each(['plain', 'stylish', 'json'])('%s', async (format) => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), path.join('__fixtures__', `result-${format}.txt`)), 'utf-8').trim();
    const actual = genDiff(filepath1, filepath2, format);
    expect(actual).toBe(expected);
  });

  test('no formatter', async () => {
    const expected = fs.readFileSync(path.resolve(process.cwd(), path.join('__fixtures__', 'result-stylish.txt')), 'utf-8').trim();
    const actual = genDiff(filepath1, filepath2);
    expect(actual).toBe(expected);
  });
});
