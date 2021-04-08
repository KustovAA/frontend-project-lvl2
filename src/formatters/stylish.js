import _ from 'lodash';

const indent = 2;

const genIndent = (depth) => ' '.repeat(depth);

const transformValue = (value, depth = 0, mapping) => {
  if (_.isPlainObject(value)) {
    return ['{']
      .concat(
        _.keys(value)
          .map((key) => mapping.unchanged({ key, value: value[key] }, depth + indent * 2)),
      )
      .concat([`${genIndent(depth)}  }`])
      .join('\n');
  }

  return value;
};

const signMap = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const genRow = ({ key, value }, sign, depth, mapping) => `${genIndent(depth)}${signMap[sign]} ${key}: ${transformValue(value, depth, mapping)}`;

const genAddedRow = ({ key, value }, depth, mapping) => genRow({ key, value }, 'added', depth, mapping);

const genRemovedRow = ({ key, value }, depth, mapping) => genRow({ key, value }, 'removed', depth, mapping);

const genUnchangedRow = ({ key, value }, depth, mapping) => genRow({ key, value }, 'unchanged', depth, mapping);

const genChangedRow = ({ key, value1, value2 }, depth, mapping) => `${genRemovedRow({ key, value: value2 }, depth, mapping)}\n${genAddedRow({ key, value: value1 }, depth, mapping)}`;

const mapping = {
  unchanged: ({ key, value }, depth = indent) => genUnchangedRow({ key, value }, depth, mapping),
  changed: (value, depth = indent) => genChangedRow(value, depth, mapping),
  added: ({ key, value }, depth = indent) => genAddedRow({ key, value }, depth, mapping),
  removed: ({ key, value }, depth = indent) => genRemovedRow({ key, value }, depth, mapping),
  recursive: ({ key, keys }, depth = indent) => [`${genIndent(depth)}  ${key}: {`].concat(keys.map((node) => mapping[node.type](node, depth + indent * indent))).concat([`${genIndent(depth)}  }`]).join('\n'),
};

const stylish = (actions) => ['{'].concat(actions.map(({
  type, key, value, value2, value1, keys,
}) => mapping[type]({
  key, value, value2, value1, keys, type,
}))).concat(['}']).flat(Infinity).join('\n');

export default stylish;
