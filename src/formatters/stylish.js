import _ from 'lodash';

const indent = 2;

const transformValue = (value, depth = 0, mapping) => {
  if (_.isPlainObject(value)) {
    return ['{']
      .concat(
        _.keys(value)
          .map((key) => mapping.unchanged({ key, value: value[key] }, depth + indent * 2)),
      )
      .concat([`${' '.repeat(depth)}  }`])
      .join('\n');
  }

  return value;
};

const stylishMapping = {
  unchanged: ({ key, value }, depth = indent) => `${' '.repeat(depth)}  ${key}: ${transformValue(value, depth, stylishMapping)}`,
  changed: ({ key, value1, value2 }, depth = indent) => `${' '.repeat(depth)}- ${key}: ${transformValue(value2, depth, stylishMapping)}\n${' '.repeat(depth)}+ ${key}: ${transformValue(value1, depth, stylishMapping)}`,
  added: ({ key, value }, depth = indent) => `${' '.repeat(depth)}+ ${key}: ${transformValue(value, depth, stylishMapping)}`,
  removed: ({ key, value }, depth = indent) => `${' '.repeat(depth)}- ${key}: ${transformValue(value, depth, stylishMapping)}`,
  recursive: ({ key, keys }, depth = indent) => [`${' '.repeat(depth)}  ${key}: {`].concat(keys.map((node) => stylishMapping[node.type](node, depth + indent * indent))).concat([`${' '.repeat(depth)}  }`]).join('\n'),
};

const stylish = (actions) => ['{'].concat(actions.map(({
  type, key, value, value2, value1, keys,
}) => stylishMapping[type]({
  key, value, value2, value1, keys, type,
}))).concat(['}']).flat(Infinity).join('\n');

export default stylish;
