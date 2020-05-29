import _ from 'lodash';

export default (props) => {
  const { object1, object2, action, alphabetize } = props;
  console.log('in create_edit_document, getTranslationObject, in else if object1, object2: ', object1, object2);

  const treatedObject = {};
  const allObject = {};
  const overlapObject = {};

  const addToCategorizedObjects = (object, each) => {
    if (treatedObject[object[each].category]) {
      if (object[each].group) {
        if (treatedObject[object[each].category][object[each].group]) {
          treatedObject[object[each].category][object[each].group][each] = object[each];
        } else {
          treatedObject[object[each].category][object[each].group] = { [each]: object[each] };
        }
      } else {
        treatedObject[object[each].category][each] = object[each];
      }
    } else { //else of if treatedObject[object[each].category]
      treatedObject[object[each].category] = { [each]: object[each] };
    }
    // Always get an object with all unoverlapped keys and associated objects
    allObject[each] = object[each];
  };

  // const addToAllObject = (object, each) => {
  //   treatedObject[each];
  // }
  // Iterate through each object1 key to get returnObject if category is assigned
  // and get overlapped keys with object2; If overlap, place in overlapObject;
  _.each(Object.keys(object1), each => {
    if (object2 && object2[each]) overlapObject[each] = null;
    if (object1[each].category && action === 'categorize') addToCategorizedObjects(object1, each);
    // if (object1[each].category && action === 'all') treatedObject[each] = object1[each];
  });
  // If object2, iterate through and get returnObject if not overlapped
  // and there is a category assigned
  if (object2) {
    _.each(Object.keys(object2), each => {
      if (object2[each].category && !overlapObject[each] && action === 'categorize') addToCategorizedObjects(object2, each);
      // if (object2[each].category && !overlapObject[each] && action === 'all') treatedObject[each] = object2[each];
    });
  }

  // if (alphabetize) {
  //
  // }

  return { treatedObject, allObject };
};
