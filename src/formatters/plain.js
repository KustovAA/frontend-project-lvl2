import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return `${value}`;
};

const plainMapping = {
  unchanged: () => [],
  changed: ({ key, value1, value2 }, path = []) => `Property '${path.concat(key).join('.')}' was updated. From ${stringify(value2)} to ${stringify(value1)}`,
  added: ({ key, value }, path = []) => `Property '${path.concat(key).join('.')}' was added with value: ${stringify(value)}`,
  removed: ({ key }, path = []) => `Property '${path.concat(key).join('.')}' was removed`,
  recursive: (
    { key, keys }, path = [],
  ) => keys.map((node) => plainMapping[node.type](node, path.concat(key))),
};

const plain = (nodes) => _.flatMapDeep(nodes, (node) => plainMapping[node.type](node)).join('\n');

export default plain;
