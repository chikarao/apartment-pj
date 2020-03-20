// import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    wrapperDiv,
    wrapperDivDimensions,
    otherChoicesArray,
    templateElements,
    backgroundDimensions,
    // below for align only not drag
    notDrag,
    tabHeight,
    widthHeight,
    topLeft,
    changeChoiceIndexArray,
    choiceButton
  } = props;

  const otherChoicesObject = {};

  let otherIndex = null;
  let eachOtherDims = null;
  let eachOtherInState = null;
  const elementId = wrapperDiv.getAttribute('id').split('-')[2];

  if (!notDrag) {
    // Get dimensions in PX of EACH OF other choices
    _.each(otherChoicesArray, each => {
      otherIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      otherChoicesObject[otherIndex] = {};
      eachOtherDims = each.getBoundingClientRect();
      eachOtherInState = templateElements[elementId].document_field_choices[otherIndex];
      // If document_field_choices already have top and other attributes,
      // Get values from state. Otherwise get top from getBoundingClientRect object
      if (eachOtherInState.top) {
        otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
        otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
        otherChoicesObject[otherIndex].topInPx = (((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top);
        otherChoicesObject[otherIndex].leftInPx = (((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left);
        otherChoicesObject[otherIndex].originalTopInPx = (((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top) - wrapperDivDimensions.top;
        otherChoicesObject[otherIndex].originalLeftInPx = (((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left) - wrapperDivDimensions.left;

      } else {
        otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
        otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
        otherChoicesObject[otherIndex].topInPx = eachOtherDims.top;
        otherChoicesObject[otherIndex].leftInPx = eachOtherDims.left;
        otherChoicesObject[otherIndex].originalTopInPx = eachOtherDims.top - wrapperDivDimensions.top;
        otherChoicesObject[otherIndex].originalLeftInPx = eachOtherDims.left - wrapperDivDimensions.left;
      }
      otherChoicesObject[otherIndex].element = each;
    });
  } // end of if !notDrag

  if (notDrag) {
    const baseChoiceIndex = parseInt(choiceButton.getAttribute('value').split(',')[1], 10);
    const baseChoiceInState = templateElements[elementId].document_field_choices[baseChoiceIndex];
    // otherChoicesObject = {};
    _.each(otherChoicesArray, each => {
      otherIndex = parseInt(each.getAttribute('value').split(',')[1], 10);

      otherChoicesObject[otherIndex] = {};
      eachOtherInState = templateElements[elementId].document_field_choices[otherIndex];
      // If choice is changed; incluced in the changeChoiceIndexArray
      if (changeChoiceIndexArray.indexOf(otherIndex) !== -1) {
        console.log('in get_other_choices_object, if not drag otherChoicesArray, changeChoiceIndexArray, each: ', otherChoicesArray, changeChoiceIndexArray, each);
      // if the choice has been changed
        // otherChoicesObject[otherIndex].topInPx = (((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top);
        // otherChoicesObject[otherIndex].leftInPx = (((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left);
        // If align horizontal, take the left in state of the base choice, and if not take its own from state
        if (topLeft === 'left') {
          otherChoicesObject[otherIndex].leftInPx = ((parseFloat(baseChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
          otherChoicesObject[otherIndex].topInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
        }
        if (topLeft !== 'left') {
          otherChoicesObject[otherIndex].topInPx = ((parseFloat(baseChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
          otherChoicesObject[otherIndex].leftInPx = ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
        }
        // otherChoicesObject[otherIndex].originalTopInPx = (parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height;
        // otherChoicesObject[otherIndex].originalLeftInPx = (parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width;
        // otherChoicesObject[otherIndex].originalTopInPx = (((parseFloat(eachOtherInState.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top);
        // otherChoicesObject[otherIndex].originalLeftInPx = (((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left);
        otherChoicesObject[otherIndex].originalTopInPx = ((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight));
        otherChoicesObject[otherIndex].originalLeftInPx = ((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width);
      } else {
        console.log('in get_other_choices_object, if not drag in else otherChoicesArray, changeChoiceIndexArray, each: ', otherChoicesArray, changeChoiceIndexArray, each);
        // otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
        // otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
        otherChoicesObject[otherIndex].topInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
        otherChoicesObject[otherIndex].leftInPx = ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
        otherChoicesObject[otherIndex].originalTopInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) - wrapperDivDimensions.top;
        otherChoicesObject[otherIndex].originalLeftInPx = ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) - wrapperDivDimensions.left;
      }
      otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
      otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
    }); // end of each otherChoicesArray
  } // end of if notDrag

    return otherChoicesObject;
  };
