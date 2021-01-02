import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = async (filepath1, filepath2) => {
  const path1 = path.resolve(process.cwd(), filepath1);
  const path2 = path.resolve(process.cwd(), filepath2);
  const files = await Promise.all([fs.readFile(path1, 'utf-8'), fs.readFile(path2, 'utf-8')]);
  const [file1, file2] = files.map((file) => JSON.parse(file));
  const result = ['', '{'];

  _.forOwn(file2, (value, key) => {
    if (!_.has(file1, key)) {
      result.push(` + ${key}: ${value}`);
    } else if (file1[key] === value) {
      result.push(`   ${key}: ${file1[key]}`);
    } else {
      result.push(` - ${key}: ${file1[key]}`);
      result.push(` + ${key}: ${value}`);
    }
  });

  _.forOwn(file1, (value, key) => {
    if (!_.has(file2, key)) {
      result.push(` - ${key}: ${value}`);
    }
  });

  result.push('}', '');

  return result.join('\n');
};

export default genDiff;
