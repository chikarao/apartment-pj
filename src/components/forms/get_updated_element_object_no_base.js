// import React from 'react';
import _ from 'lodash';

import setBoundaries from './set_choice_wrapper_boundaries';
import getUpdatedElementObject from './get_element_update_object';
import getNewDocumentFieldChoices from './get_new_document_field_choices';
import getOtherChoicesObject from './get_other_choices_object';

// NOTE: This function is designed to set state values of choices and wrapper
// in app state state when choices are moved without a base choice such as in align choice
// The function iterates through selectedChoiceIdArray and a moveIncrement or expandInrement and
// output a new object for use in the action and document reducer
export default (props) => {
  const {
    templateElements,
    direction,
    moveIncrement,
    selectedChoiceIdArray,
    tabHeight,
    // Below for expand contract
    expandContract,
    expandContractIncrement,
    // Below for longActionPress expandContract
    longActionPress,
    action
  } = props;

  const array = [];
  let moveIncrementLocal = moveIncrement;
  let expandContractIncrementLocal = expandContractIncrement;

  // let choiceElementsArray = [];
  let changeChoicesArray = [];
  let changeChoiceIndexArray = [];
  // let changeChoiceIndexObject = {};
  let otherChoicesArray = [];
  const alignControlArray = [];
  let eachElementId = null;
  let eachChoiceIndex = null;
  let eachElementInState = null;
  let eachBaseChoice = null;
  let eachWrapperDiv = null;
  let eachWrapperDivDimensions = null;
  let otherChoice = null;
  let changeChoice = null;
  let allChoicesObject = null;
  let documentFieldObject = null;
  let eachChoicePxDimensionsArray = null;
  let newDocumentFieldChoices = null;
  let oldDocumentFieldChoices = null;
  let lastWrapperDivDims = null;
  let updatedElementObject = null;

  const backgroundDimensions = document.getElementById(`template-element-${selectedChoiceIdArray[0].split('-')[0]}`).parentElement.getBoundingClientRect();

  _.each(selectedChoiceIdArray, eachChoiceId => {
    // Go through each choice Id and get an array of choices to be changed
    // Get new document_field_choices
    eachElementId = eachChoiceId.split('-')[0];
    if (alignControlArray.indexOf(eachElementId) === -1) {
      // push eachElementId avoid doing the same element multiple times
      alignControlArray.push(eachElementId);
      console.log('in create_edit_document, moveElement, _.each(this.state.se, direction, this.state.selectedChoiceIdArray, eachChoiceId, eachElementId, alignControlArray', direction, selectedChoiceIdArray, eachChoiceId, eachElementId, alignControlArray);
      eachChoiceIndex = parseInt(eachChoiceId.split('-')[1], 10);
      eachElementInState = templateElements[eachElementId];
      // eachBaseChoiceInState = templateElements[eachElementId].document_field_choices[eachChoiceIndex];
      eachBaseChoice = document.getElementById(`template-element-button-${eachElementId},${eachChoiceIndex}`);
      // eachBaseChoiceDimensions = eachBaseChoice.getBoundingClientRect();
      eachWrapperDiv = eachBaseChoice.parentElement.parentElement.parentElement;
      eachWrapperDivDimensions = eachWrapperDiv.getBoundingClientRect();
    } // end of if (alignControlArray.indexOf(eachElementId) === -1) {
      // Attribute is like moveObject[moveLeft] = { choicAttr: top...}
    _.each(Object.keys(eachElementInState.document_field_choices), eachIdx => {
      // If choice not selected or not base (first selected), push into array to get obejct
      // If the element and choice index are not in the selectedChoiceIdArray, push into other choice array
      if (selectedChoiceIdArray.indexOf(`${eachElementId}-${eachIdx}`) === -1) {
        otherChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
        otherChoicesArray.push(otherChoice);
      } else if (selectedChoiceIdArray.indexOf(`${eachElementId}-${eachIdx}`) !== -1) {
        // else if the element and choice are included in selectedChoiceIdArray
        // get choice from DOM push choice into array for change
        changeChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
        changeChoicesArray.push(changeChoice)
        changeChoiceIndexArray.push(parseInt(eachIdx, 10));
      }
    }); // end of _.each(Object.keys(eachElementInState.document_field_choices
      direction === 'moveLeft' || direction === 'moveUp' ? moveIncrementLocal = -moveIncrementLocal : null;
      expandContract === 'contractHorizontal' || expandContract === 'contractVertical' ? expandContractIncrementLocal = -expandContractIncrementLocal : null;
      // !!!! Get object with PX values of each choice
      // while changing coordinates of selected choices
      if (moveIncrement) {
        allChoicesObject = getOtherChoicesObject({ wrapperDiv: eachWrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, choiceMove: true, tabHeight, widthHeight: false, moveIncrement: moveIncrementLocal, direction, changeChoiceIndexArray });
      }

      if (expandContractIncrement) {
        allChoicesObject = getOtherChoicesObject({ wrapperDiv: eachWrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, choiceExpandContract: true, tabHeight, widthHeight: false, expandContractIncrement: expandContractIncrementLocal, expandContract, changeChoiceIndexArray });
      }

      if (longActionPress) {
        allChoicesObject = getOtherChoicesObject({ wrapperDiv: eachWrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, tabHeight, longActionPress, action, changeChoiceIndexArray });
      }

      documentFieldObject = getNewDocumentFieldChoices({ choiceIndex: null, templateElements, iteratedElements: otherChoicesArray.concat(changeChoicesArray), otherChoicesObject: allChoicesObject, backgroundDimensions });
      eachChoicePxDimensionsArray = documentFieldObject.array;
      // New and old records of choices to be set in app stata in templateElements
      // get new and old document field choices
      newDocumentFieldChoices = documentFieldObject.newDocumentFieldChoices;
      oldDocumentFieldChoices = documentFieldObject.oldDocumentFieldChoices;
      // get wrapper dimensions
      lastWrapperDivDims = setBoundaries({ elementsArray: eachChoicePxDimensionsArray, newWrapperDims: {}, adjustmentPx: 0 });
      updatedElementObject = getUpdatedElementObject({ elementId: eachElementId, lastWrapperDivDims, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, newDocumentFieldChoices, oldDocumentFieldChoices, tabHeight })
      // push into array to be sent to action and reducer
      array.push(updatedElementObject)
      console.log('in create_edit_document, getUpdatedElementObjectNoBase, moveElement allChoicesObject, array: ', allChoicesObject, array);

      changeChoiceIndexArray = [];
      changeChoicesArray = [];
      otherChoicesArray = [];
      // Change moveIncrementLocal back to positive if negative
      moveIncrementLocal = moveIncrementLocal > 0 ? moveIncrementLocal : -moveIncrementLocal;
  }); // end of _.each(this.state.selectedChoiceIdArray
    // array to be sent to action and reducer
    return array;
  }; // End of export default (props) => {
