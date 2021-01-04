import _ from 'lodash';

const indent = 2;

const stylishMapping = {
  unchanged: ({ key, value }, depth = indent) => `${' '.repeat(depth)}  ${key}: ${stylishMapping.transformValue(value, depth)}`,
  changed: ({ key, newValue, oldValue }, depth = indent) => `${' '.repeat(depth)}- ${key}: ${stylishMapping.transformValue(oldValue, depth)}\n${' '.repeat(depth)}+ ${key}: ${stylishMapping.transformValue(newValue, depth)}`,
  added: ({ key, value }, depth = indent) => `${' '.repeat(depth)}+ ${key}: ${stylishMapping.transformValue(value, depth)}`,
  removed: ({ key, value }, depth = indent) => `${' '.repeat(depth)}- ${key}: ${stylishMapping.transformValue(value, depth)}`,
  recursive: ({ key, keys }, depth = indent) => [`${' '.repeat(depth)}  ${key}: {`].concat(keys.map((node) => stylishMapping[node.type](node, depth + indent * 2))).concat([`${' '.repeat(depth)}  }`]).join('\n'),
  transformValue: (value, depth = 0) => {
    if (_.isPlainObject(value)) {
      return ['{']
        .concat(
          _.sortBy(_.keys(value))
            .map((key) => stylishMapping.unchanged({ key, value: value[key] }, depth + indent * 2)),
        )
        .concat([`${' '.repeat(depth)}  }`])
        .join('\n');
    }

    return value;
  },
};

const stylish = (actions) => ['', '{'].concat(actions.map(({
  type, key, value, oldValue, newValue, keys,
}) => stylishMapping[type]({
  key, value, oldValue, newValue, keys, type,
}))).concat(['}', '']).flat(Infinity).join('\n');

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

const plain = (actions) => [''].concat(actions.map((action) => plainMapping[action.type](action))).concat(['']).flat(Infinity).join('\n');

const formats = {
  stylish,
  plain,
  json: (val) => '\n'.concat(JSON.stringify(val)).concat('\n'),
};

const createFormatter = (format) => formats[format];

export default createFormatter;
