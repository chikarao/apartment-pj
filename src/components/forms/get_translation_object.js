import _ from 'lodash';

export default (props) => {
  const { object1, object2, action, alphabetize } = props;
  console.log('in create_edit_document, getTranslationObject, in else if object1, object2: ', object1, object2);

  const returnedObject = {};
  const overlapObject = {};

  const addToCategorizedObject = (object, each) => {
    if (returnedObject[object[each].category]) {
      if (object[each].group) {
        if (returnedObject[object[each].category][object[each].group]) {
          returnedObject[object[each].category][object[each].group][each] = object[each];
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

  // const addToAllObject = (object, each) => {
  //   returnedObject[each];
  // }
  // Iterate through each object1 key to get returnObject if category is assigned
  // and get overlapped keys with object2; If overlap, place in overlapObject;
  _.each(Object.keys(object1), each => {
    if (object2 && object2[each]) overlapObject[each] = null;
    if (object1[each].category && action === 'categorize') addToCategorizedObject(object1, each);
    if (object1[each].category && action === 'all') returnedObject[each] = object1[each];
  });
  // If object2, iterate through and get returnObject if not overlapped
  // and there is a category assigned
  if (object2) {
    _.each(Object.keys(object2), each => {
      if (object2[each].category && !overlapObject[each] && action === 'categorize') addToCategorizedObject(object2, each);
      if (object2[each].category && !overlapObject[each] && action === 'all') returnedObject[each] = object2[each];
    });
  }

  // if (alphabetize) {
  //
  // }

  return returnedObject;
};
