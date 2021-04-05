import _ from 'lodash';

const plainMapping = {
  unchanged: () => [],
  changed: ({ key, newValue, oldValue }, path = []) => `Property '${path.concat(key).join('.')}' was updated. From ${plainMapping.transformValue(oldValue)} to ${plainMapping.transformValue(newValue)}`,
  added: ({ key, value }, path = []) => `Property '${path.concat(key).join('.')}' was added with value: ${plainMapping.transformValue(value)}`,
  removed: ({ key }, path = []) => `Property '${path.concat(key).join('.')}' was removed`,
  recursive: (
    { key, keys }, path = [],
  ) => keys.map((node) => plainMapping[node.type](node, path.concat(key))),
  transformValue: (value) => {
    if (_.isObject(value)) {
      return '[complex value]';
    }

    if (_.isString(value)) {
      return `'${value}'`;
    }

    return value;
  },
};

const plain = (actions) => actions.map((action) => plainMapping[action.type](action)).flat(Infinity).join('\n');

export default plain;
