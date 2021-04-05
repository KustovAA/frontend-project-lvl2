import yaml from 'js-yaml';

const parserMap = {
  json: (file) => JSON.parse(file),
  yaml: (file) => yaml.load(file),
  yml: (file) => yaml.load(file),
};

const parse = (file, ext) => parserMap?.[ext]?.(file);

export default parse;
