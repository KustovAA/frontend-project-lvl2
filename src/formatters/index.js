import plain from './plain.js';
import stylish from './stylish.js';

const formatters = {
  stylish,
  plain,
  json: JSON.stringify,
};

const createFormatter = (formatterType) => formatters[formatterType];

export default createFormatter;
