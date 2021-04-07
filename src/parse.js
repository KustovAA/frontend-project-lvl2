import yaml from 'js-yaml';

const parserMap = {
  json: (file) => JSON.parse(file),
  yaml: (file) => yaml.load(file),
  yml: (file) => yaml.load(file),
};

const createParser = (ext) => {
  if (!parserMap[ext]) {
    throw new Error(`File with extension ${ext} can't be parsed`);
  }

  return parserMap[ext];
};

export default createParser;
