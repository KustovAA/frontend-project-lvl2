import _ from 'lodash';

const getDiffTree = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  return keys.map((key) => {
    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: obj2[key] };
    }

    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: obj1[key] };
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, type: 'recursive', keys: getDiffTree(obj1[key], obj2[key]) };
    }

    if (_.isEqual(obj1[key], obj2[key])) {
      return { key, type: 'unchanged', value: obj1[key] };
    }

    return {
      key, type: 'changed', newValue: obj2[key], oldValue: obj1[key],
    };
  });
};

export default getDiffTree;
