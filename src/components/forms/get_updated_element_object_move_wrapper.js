// import React from 'react';
import _ from 'lodash';

import setBoundaries from './set_choice_wrapper_boundaries';
import getUpdatedElementObject from './get_element_update_object';
import getNewDocumentFieldChoices from './get_new_document_field_choices';
import getOtherChoicesObject from './get_other_choices_object';

// Function takes eachElementId and outputs a new object to send to reducer
export default (props) => {
  const {
    eachElementId,
    wrapperDiv,
    templateElements,
    originalWrapperDivDimensions,
    tabHeight,
    elementDrag,
    delta
  } = props;

  let choice = null;
  const choiceElementsArray = [];
  const eachElement = templateElements[eachElementId];
  const wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
  const backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();


  _.each(Object.keys(eachElement.document_field_choices), eachChoiceIdx => {
    choice = document.getElementById(`template-element-button-${eachElementId},${eachChoiceIdx}`);
    choiceElementsArray.push(choice)
  });

  const allChoicesObject = getOtherChoicesObject({ wrapperDiv, otherChoicesArray: choiceElementsArray, templateElements, backgroundDimensions, wrapperDivDimensions, elementDrag, tabHeight, delta });

  const documentFieldObject = getNewDocumentFieldChoices({ choiceIndex: null, templateElements, iteratedElements: choiceElementsArray, otherChoicesObject: allChoicesObject, backgroundDimensions, choiceButtonWidthInPx: null, choiceButtonHeightInPx: null });
  const eachChoicePxDimensionsArray = documentFieldObject.array;
  // New and old records of choices to be set in app stata in templateElements
  // get new and old document field choices
  const newDocumentFieldChoices = documentFieldObject.newDocumentFieldChoices;
  const oldDocumentFieldChoices = documentFieldObject.oldDocumentFieldChoices;
  // get wrapper dimensions
  // Get the new wrapper dimensions based on actual choice in DOM
  const lastWrapperDivDimsInPx = setBoundaries({ elementsArray: eachChoicePxDimensionsArray, newWrapperDims: {}, adjustmentPx: 0 });
  const lastWrapperDivDims = {
      topInPx: lastWrapperDivDimsInPx.topInPx,
      leftInPx: lastWrapperDivDimsInPx.leftInPx,
      widthInPx: lastWrapperDivDimsInPx.widthInPx,
      heightInPx: lastWrapperDivDimsInPx.heightInPx
    };

  const updatedElementObject = getUpdatedElementObject({ elementId: eachElementId, lastWrapperDivDims, backgroundDimensions, wrapperDivDimensions: originalWrapperDivDimensions, newDocumentFieldChoices, oldDocumentFieldChoices, tabHeight })
  console.log('in get_updated_element_object_summary, dragElement, closeDragElement, in each, updatedElementObject, ', updatedElementObject);

  return updatedElementObject;
};
