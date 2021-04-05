import fs from 'fs';
import path from 'path';
import createFormatter from './formatters/index.js';
import getDiffTree from './getDiffTree.js';
import parse from './parse.js';

const readFiles = (filepath1, filepath2) => {
  const path1 = path.resolve(process.cwd(), filepath1);
  const path2 = path.resolve(process.cwd(), filepath2);
  const ext = path.extname(filepath1).slice(1);
  const files = [fs.readFileSync(path1, 'utf-8'), fs.readFileSync(path2, 'utf-8')];
  const [file1, file2] = files.map((file) => parse(file, ext));
  return { file1, file2 };
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const { file1, file2 } = readFiles(filepath1, filepath2, format);
  const diffList = getDiffTree(file1, file2);
  const formatter = createFormatter(format);
  return formatter(diffList);
};

export default genDiff;
