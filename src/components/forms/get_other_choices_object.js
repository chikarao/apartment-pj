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
    baseWrapperDiv,
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

  // if not dragging and aligning
  if (notDrag) {
    const baseElementId = baseWrapperDiv.getAttribute('id').split('-')[2];
    const baseChoiceIndex = parseInt(choiceButton.getAttribute('value').split(',')[1], 10);
    const baseChoiceInState = templateElements[baseElementId].document_field_choices[baseChoiceIndex];
    const baseChoiceDims = choiceButton.getBoundingClientRect();
    let stateValExistEach = false;
    const stateValExistBase = baseChoiceInState.top;
    let leftValue = null;
    let topValue = null;
    // otherChoicesObject = {};
    _.each(otherChoicesArray, each => {
      otherIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      eachOtherDims = each.getBoundingClientRect();

      otherChoicesObject[otherIndex] = {};
      eachOtherInState = templateElements[elementId].document_field_choices[otherIndex];
      stateValExistEach = eachOtherInState.top;
      // If choice is changed; incluced in the changeChoiceIndexArray
      if (changeChoiceIndexArray.indexOf(otherIndex) !== -1) {
      // if the choice has been changed
        // otherChoicesObject[otherIndex].topInPx = (((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top);
        // otherChoicesObject[otherIndex].leftInPx = (((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left);
        // If align horizontal, take the left in state of the base choice, and if not take its own from state
        if (topLeft === 'left') {
          // get left and top values from state if value exists;
          // If no state value, get from dimensions from getBoundingClientRect
          leftValue = stateValExistBase ?
                      ((parseFloat(baseChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left
                      :
                      baseChoiceDims.left;
          topValue = stateValExistEach ?
                      ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top
                      :
                      eachOtherDims.top;

         console.log('in get_other_choices_object, if not drag each, in topLeft === left leftValue, topValue, baseChoiceDims, eachOtherDims: ', each, leftValue, topValue, baseChoiceDims, eachOtherDims);
          otherChoicesObject[otherIndex].leftInPx = leftValue;
          // otherChoicesObject[otherIndex].leftInPx = ((parseFloat(baseChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
          otherChoicesObject[otherIndex].topInPx = topValue;
          // otherChoicesObject[otherIndex].topInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
        }
        if (topLeft !== 'left') {
          // get left and top values from state if value exists;
          // If no state value, get from dimensions from getBoundingClientRect
          leftValue = stateValExistEach ?
                      ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left
                      :
                      eachOtherDims.left;
          topValue = stateValExistBase ?
                    ((parseFloat(baseChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top
                    :
                    baseChoiceDims.top;
          otherChoicesObject[otherIndex].topInPx = topValue;
          otherChoicesObject[otherIndex].leftInPx = leftValue;
          console.log('in get_other_choices_object, if not drag otherChoicesArray, each, in topLeft !== left leftValue, topValue, baseChoiceInState, eachOtherInState, baseChoiceDims, eachOtherDims: ', otherChoicesArray, each, leftValue, topValue, baseChoiceInState, eachOtherInState, baseChoiceDims, eachOtherDims);
        }
        // otherChoicesObject[otherIndex].originalTopInPx = (parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height;
        // otherChoicesObject[otherIndex].originalLeftInPx = (parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width;
        // otherChoicesObject[otherIndex].originalTopInPx = (((parseFloat(eachOtherInState.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top);
        // otherChoicesObject[otherIndex].originalLeftInPx = (((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left);
        // otherChoicesObject[otherIndex].originalTopInPx = ((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight));
        // otherChoicesObject[otherIndex].originalLeftInPx = ((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width);
      } else { // else of if (changeChoiceIndexArray.indexOf(otherIndex) !== -1)
        // If the choices are not boing changed
        console.log('in get_other_choices_object, if not drag in else otherChoicesArray, changeChoiceIndexArray, each: ', otherChoicesArray, changeChoiceIndexArray, each);
        // otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
        // otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
        if (stateValExistEach) {
          otherChoicesObject[otherIndex].topInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
          otherChoicesObject[otherIndex].leftInPx = ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
          // otherChoicesObject[otherIndex].originalTopInPx = ((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) - wrapperDivDimensions.top;
          // otherChoicesObject[otherIndex].originalLeftInPx = ((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) - wrapperDivDimensions.left;
        } else {
          otherChoicesObject[otherIndex].topInPx = eachOtherDims.top;
          otherChoicesObject[otherIndex].leftInPx = eachOtherDims.left;
          // otherChoicesObject[otherIndex].originalTopInPx = eachOtherDims.top - wrapperDivDimensions.top;
          // otherChoicesObject[otherIndex].originalLeftInPx = eachOtherDims.left - wrapperDivDimensions.left;
        }
      }
      // Width and height are already defined at creation of choice
      // ie not driven by user click at creation of choice
      otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
      otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
    }); // end of each otherChoicesArray
  } // end of if notDrag

  console.log('in get_other_choices_object, if not drag before return elementId, otherChoicesObject, wrapperDiv, baseWrapperDiv: ', elementId, otherChoicesObject, wrapperDiv, baseWrapperDiv);
    return otherChoicesObject;
  };
