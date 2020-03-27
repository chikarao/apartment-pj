// import React from 'react';
import _ from 'lodash';

// NOTE: This function was originally designed to get PX coordinate values of
// objects that were not moved (other objects) in the choiceDrag function,
// It is used in other functions to get PX values of all choices
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
    choiceButton,
    elementDrag,
    delta,
    // for choice move
    choiceMove,
    direction,
    moveIncrement
  } = props;

  const choicesObject = {};
  let leftValue = null;
  let topValue = null;

  let choiceIndex = null;
  let eachChoiceDims = null;
  let eachChoiceInState = null;
  const elementId = wrapperDiv.getAttribute('id').split('-')[2];

  // For dragging choice and getting dimensions of other choices
  if (!notDrag && !elementDrag) {
    // Get dimensions in PX of EACH OF other choices
    _.each(otherChoicesArray, each => {
      choiceIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      choicesObject[choiceIndex] = {};
      eachChoiceDims = each.getBoundingClientRect();
      eachChoiceInState = templateElements[elementId].document_field_choices[choiceIndex];
      // If document_field_choices already have top and other attributes,
      // Get values from state. Otherwise get top from getBoundingClientRect object
      if (eachChoiceInState.top) {
       choicesObject[choiceIndex].widthInPx = (parseFloat(eachChoiceInState.width) / 100) * backgroundDimensions.width;
       choicesObject[choiceIndex].heightInPx = (parseFloat(eachChoiceInState.height) / 100) * backgroundDimensions.height;
       choicesObject[choiceIndex].topInPx = (((parseFloat(eachChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top);
       choicesObject[choiceIndex].leftInPx = (((parseFloat(eachChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left);
       choicesObject[choiceIndex].originalTopInPx = (((parseFloat(eachChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top) - wrapperDivDimensions.top;
       choicesObject[choiceIndex].originalLeftInPx = (((parseFloat(eachChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left) - wrapperDivDimensions.left;

      } else {
       choicesObject[choiceIndex].widthInPx = (parseFloat(eachChoiceInState.width) / 100) * backgroundDimensions.width;
       choicesObject[choiceIndex].heightInPx = (parseFloat(eachChoiceInState.height) / 100) * backgroundDimensions.height;
       choicesObject[choiceIndex].topInPx = eachChoiceDims.top;
       choicesObject[choiceIndex].leftInPx = eachChoiceDims.left;
       choicesObject[choiceIndex].originalTopInPx = eachChoiceDims.top - wrapperDivDimensions.top;
       choicesObject[choiceIndex].originalLeftInPx = eachChoiceDims.left - wrapperDivDimensions.left;
      }
     choicesObject[choiceIndex].element = each;
    });
  } // end of if !notDrag

  // if not dragging and aligning, meaning dragChoice
  if (notDrag) {
    const baseElementId = baseWrapperDiv.getAttribute('id').split('-')[2];
    const baseChoiceIndex = parseInt(choiceButton.getAttribute('value').split(',')[1], 10);
    const baseChoiceInState = templateElements[baseElementId].document_field_choices[baseChoiceIndex];
    const baseChoiceDims = choiceButton.getBoundingClientRect();
    const stateValExistBase = baseChoiceInState.top;
    let stateValExistEach = false;
    _.each(otherChoicesArray, each => {
      choiceIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      eachChoiceDims = each.getBoundingClientRect();

      choicesObject[choiceIndex] = {};
      eachChoiceInState = templateElements[elementId].document_field_choices[choiceIndex];
      stateValExistEach = eachChoiceInState.top;
      // If choice is changed; incluced in the changeChoiceIndexArray
      if (changeChoiceIndexArray.indexOf(choiceIndex) !== -1) {
      // if the choice has been changed
        // If align horizontal, take the left in state of the base choice, and if not take its own from state
        if (topLeft === 'left') {
          // get left and top values from state if value exists;
          // If no state value, get from dimensions from getBoundingClientRect
          leftValue = stateValExistBase ?
                      ((parseFloat(baseChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left
                      :
                      baseChoiceDims.left;
          topValue = stateValExistEach ?
                      ((parseFloat(eachChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top
                      :
                      eachChoiceDims.top;

         console.log('in get_other_choices_object, if not drag each, in topLeft === left leftValue, topValue, baseChoiceDims, eachChoiceDims: ', each, leftValue, topValue, baseChoiceDims, eachChoiceDims);
         choicesObject[choiceIndex].leftInPx = leftValue;
         choicesObject[choiceIndex].topInPx = topValue;
        }

        if (topLeft !== 'left') {
          // get left and top values from state if value exists;
          // If no state value, get from dimensions from getBoundingClientRect
          leftValue = stateValExistEach ?
                      ((parseFloat(eachChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left
                      :
                      eachChoiceDims.left;
          topValue = stateValExistBase ?
                    ((parseFloat(baseChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top
                    :
                    baseChoiceDims.top;
         choicesObject[choiceIndex].topInPx = topValue;
         choicesObject[choiceIndex].leftInPx = leftValue;
          console.log('in get_other_choices_object, if not drag otherChoicesArray, each, in topLeft !== left leftValue, topValue, baseChoiceInState, eachChoiceInState, baseChoiceDims, eachChoiceDims: ', otherChoicesArray, each, leftValue, topValue, baseChoiceInState, eachChoiceInState, baseChoiceDims, eachChoiceDims);
        }
      } else { // else of if (changeChoiceIndexArray.indexOf(choiceIndex) !== -1)
        // If the choices are not boing changed
        console.log('in get_other_choices_object, if not drag in else otherChoicesArray, changeChoiceIndexArray, each: ', otherChoicesArray, changeChoiceIndexArray, each);
        if (stateValExistEach) {
         choicesObject[choiceIndex].topInPx = ((parseFloat(eachChoiceInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top;
         choicesObject[choiceIndex].leftInPx = ((parseFloat(eachChoiceInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left;
        } else {
         choicesObject[choiceIndex].topInPx = eachChoiceDims.top;
         choicesObject[choiceIndex].leftInPx = eachChoiceDims.left;
        }
      } // end of else if if (changeChoiceIndexArray.indexOf(choiceIndex)
      // Width and height are already defined at creation of choice
      // ie not driven by user click at creation of choice
     choicesObject[choiceIndex].widthInPx = (parseFloat(eachChoiceInState.width) / 100) * backgroundDimensions.width;
     choicesObject[choiceIndex].heightInPx = (parseFloat(eachChoiceInState.height) / 100) * backgroundDimensions.height;
    }); // end of each otherChoicesArray
  } // end of if notDrag

  // For dragging eleeent and updating choices
  if (elementDrag) {
    // For case of getting array of choices that have been moved and getting
    // the PX values of each in object
    let stateValExistEach = false;
    // let wrapperDivDims = null;
    _.each(otherChoicesArray, each => {
      eachElementId = each.getAttribute('value').split(',')[0];
      choiceIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      choicesObject[choiceIndex] = {};
      eachChoiceInState = templateElements[elementId].document_field_choices[choiceIndex];
      // eachChoiceDims = each.getBoundingClientRect();
      // stateValExistEach = eachChoiceInState.top;
      leftValue = ((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left;
      topValue = ((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top;
      console.log('in get_other_choices_object, if not drag before return each.id, each.style.left, wrapperDivDimensions, leftValue, topValue: ', each.id, each.style.left, wrapperDivDimensions, leftValue, topValue);

      choicesObject[choiceIndex].topInPx = topValue;
      choicesObject[choiceIndex].leftInPx = leftValue;
      choicesObject[choiceIndex].widthInPx = (parseFloat(eachChoiceInState.width) / 100) * backgroundDimensions.width;
      choicesObject[choiceIndex].heightInPx = (parseFloat(eachChoiceInState.height) / 100) * backgroundDimensions.height;
    }) // end of _.each(otherChoicesArray
  }

  let eachElementId = null; // for use with choiceMove

  if (choiceMove) {
    // For case of getting array of choices that have been moved and getting
    // the PX values of each in object
    // let wrapperDims = null;
    // let wrapperDivDims = null;

    _.each(otherChoicesArray, each => {
      let moveLeftIncrementVal = 0;
      let moveTopIncrementVal = 0;
      // eachElementId = each.getAttribute('value').split(',')[0];
      choiceIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
      choicesObject[choiceIndex] = {};
      eachChoiceInState = templateElements[elementId].document_field_choices[choiceIndex];
      // eachChoiceDims = each.getBoundingClientRect();
      // stateValExistEach = eachChoiceInState.top;

      if (changeChoiceIndexArray.indexOf(choiceIndex) !== -1) {
        if (direction === 'moveLeft' || direction === 'moveRight') moveLeftIncrementVal = moveIncrement;
        if (direction === 'moveUp' || direction === 'moveDown') moveTopIncrementVal = moveIncrement;
      }

      // wrapperDims = changeChoiceIndexObject[eachElementId].wrapperDims;
      leftValue = ((parseFloat(each.style.left) / 100) * wrapperDivDimensions.width) + wrapperDivDimensions.left + moveLeftIncrementVal;
      topValue = ((parseFloat(each.style.top) / 100) * (wrapperDivDimensions.height - tabHeight)) + wrapperDivDimensions.top + moveTopIncrementVal;
      console.log('in get_other_choices_object, if not drag before return each.id, each.style.left, wrapperDivDimensions, leftValue, topValue, moveLeftIncrementVal: ', each.id, each.style.left, wrapperDivDimensions, leftValue, topValue, moveLeftIncrementVal);

      choicesObject[choiceIndex].topInPx = topValue;
      choicesObject[choiceIndex].leftInPx = leftValue;
      choicesObject[choiceIndex].widthInPx = (parseFloat(eachChoiceInState.width) / 100) * backgroundDimensions.width;
      choicesObject[choiceIndex].heightInPx = (parseFloat(eachChoiceInState.height) / 100) * backgroundDimensions.height;
    }) // end of _.each(otherChoicesArray
  }
  console.log('in get_other_choices_object, if not drag before return elementId, choicesObject, wrapperDiv, baseWrapperDiv, delta, backgroundDimensions: ', elementId, choicesObject, wrapperDiv, baseWrapperDiv, delta, backgroundDimensions);
    return choicesObject;
  }; // End of export default (props) => {
