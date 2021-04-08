import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixture = (filename) => fs.readFileSync(path.join(__dirname, '..', '__fixtures__', filename), 'utf-8').trim();

const fixtures = {
  plain: getFixture('result-plain.txt'),
  stylish: getFixture('result-stylish.txt'),
  json: getFixture('result-json.txt'),
};

describe.each(['json', 'yml'])('compare objects %s', (ext) => {
  const filepath1 = path.join('__fixtures__', `file1.${ext}`);
  const filepath2 = path.join('__fixtures__', `file2.${ext}`);

  test.each(['plain', 'stylish', 'json'])('%s', async (formatter) => {
    const expected = fixtures[formatter];
    const actual = genDiff(filepath1, filepath2, formatter);
    expect(actual).toBe(expected);
  });

  test('no formatter', async () => {
    const expected = fixtures.stylish;
    const actual = genDiff(filepath1, filepath2);
    expect(actual).toBe(expected);
  });
});
