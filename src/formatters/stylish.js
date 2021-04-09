import _ from 'lodash';

const indent = 2;

const generateIndent = (depth) => ' '.repeat(depth);

const stringify = (value, depth = 0, mapping) => {
  if (_.isPlainObject(value)) {
    return ['{']
      .concat(
        _.keys(value)
          .map((key) => mapping.unchanged({ key, value: value[key] }, depth + indent * 2)),
      )
      .concat([`${generateIndent(depth)}  }`])
      .join('\n');
  }

  return `${value}`;
};

const mapping = {
  added: ({ key, value }, depth = indent) => `${generateIndent(depth)}+ ${key}: ${stringify(value, depth, mapping)}`,
  removed: ({ key, value }, depth = indent) => `${generateIndent(depth)}- ${key}: ${stringify(value, depth, mapping)}`,
  unchanged: ({ key, value }, depth = indent) => `${generateIndent(depth)}  ${key}: ${stringify(value, depth, mapping)}`,
  changed: ({ key, value1, value2 }, depth = indent) => `${mapping.removed({ key, value: value2 }, depth)}\n${mapping.added({ key, value: value1 }, depth)}`,
  recursive: ({ key, keys }, depth = indent) => [`${generateIndent(depth)}  ${key}: {`].concat(keys.map((node) => mapping[node.type](node, depth + indent * indent))).concat([`${generateIndent(depth)}  }`]).join('\n'),
};

const startNode = ['{'];
const finishNode = ['}'];
const mapNode = (node) => mapping[node.type](node);

const stylish = (nodes) => startNode
  .concat(nodes.map(mapNode))
  .concat(finishNode)
  .flat(Infinity)
  .join('\n');

export default stylish;
