import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import formats from './formats.js';

const parserMap = {
  json: (file) => JSON.parse(file),
  yaml: (file) => yaml.load(file),
};

const extMap = {
  '.json': 'json',
  '.yml': 'yaml',
  '.yaml': 'yaml',
};

const parse = (file, ext) => parserMap?.[ext]?.(file);

const readFiles = async (filepath1, filepath2) => {
  const path1 = path.resolve(process.cwd(), filepath1);
  const path2 = path.resolve(process.cwd(), filepath2);
  const ext = extMap[path.extname(filepath1)];
  const files = await Promise.all([fs.readFile(path1, 'utf-8'), fs.readFile(path2, 'utf-8')]);
  const [file1, file2] = files.map((file) => parse(file, ext));
  return { file1, file2 };
};

const getDiffList = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  return keys.map((key) => {
    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: obj2[key] };
    }

    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: obj1[key] };
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, type: 'recursive', keys: getDiffList(obj1[key], obj2[key]) };
    }

    if (_.isEqual(obj1[key], obj2[key])) {
      return { key, type: 'unchanged', value: obj1[key] };
    }

    return {
      key, type: 'changed', newValue: obj2[key], oldValue: obj1[key],
    };
  });
};

const genDiff = async (filepath1, filepath2, format) => {
  const { file1, file2 } = await readFiles(filepath1, filepath2, format);
  const diffList = getDiffList(file1, file2);
  return formats[format](diffList);
};

export default genDiff;
