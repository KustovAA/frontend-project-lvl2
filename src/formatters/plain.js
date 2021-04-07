import _ from 'lodash';

const transformValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const plainMapping = {
  unchanged: () => [],
  changed: ({ key, value1, value2 }, path = []) => `Property '${path.concat(key).join('.')}' was updated. From ${transformValue(value2)} to ${transformValue(value1)}`,
  added: ({ key, value }, path = []) => `Property '${path.concat(key).join('.')}' was added with value: ${transformValue(value)}`,
  removed: ({ key }, path = []) => `Property '${path.concat(key).join('.')}' was removed`,
  recursive: (
    { key, keys }, path = [],
  ) => keys.map((node) => plainMapping[node.type](node, path.concat(key))),
};

const plain = (actions) => actions.map((action) => plainMapping[action.type](action)).flat(Infinity).join('\n');

export default plain;
