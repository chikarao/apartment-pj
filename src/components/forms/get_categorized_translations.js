import _ from 'lodash';

export default (props) => {
  const { object1, object2 } = props;

  const returnedObject = {};
  const overlapObject = {};

  const addToObject = (object, each) => {
    if (returnedObject[object[each].category]) {
      if (object[each].group) {
        if (returnedObject[object[each].category][object[each].group]) {
          returnedObject[object[each].category][object[each].group] = object[each];
        } else {
          returnedObject[object[each].category][object[each].group] = { [each]: object[each] };
        }
      } else {
        returnedObject[object[each].category][each] = object[each];
      }
    } else { //else of if returnedObject[object[each].category]
      returnedObject[object[each].category] = { [each]: object[each] };
    }
  };
  // Iterate through each object1 key to get returnObject if category is assigned
  // and get overlapped keys with object2; If overlap, place in overlapObject;
  _.each(Object.keys(object1), each => {
    if (object2 && object2[each]) overlapObject[each] = null;
    if (object1[each].category) addToObject(object1, each);
  });
  // If object2, iterate through and get returnObject if not overlapped
  // and there is a category assigned
  if (object2) {
    _.each(Object.keys(object2), each => {
      if (object2[each].category && !overlapObject[each]) addToObject(object2, each);
    });
  }

  return returnedObject;
};
