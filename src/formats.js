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
}))).concat(['}', '']).flat().join('\n');

export default {
  stylish,
};
