// import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    choiceIndex,
    templateElements,
    iteratedElements,
    otherChoicesObject,
    backgroundDimensions,
    choiceButtonWidthInPx,
    choiceButtonHeightInPx
  } = props;
    // let { } = {};
    // const iteratedElements = [...otherChoicesArray, choiceButton];
    const newDocumentFieldChoices = {};
    const oldDocumentFieldChoices = {};
    // let elementId = null;
    let elementIndex = null;
    let parentElement = null;
    let choiceElement = null;
    let top = null;
    let left = null;
    let width = null;
    let height = null;
    let widthPx = null;
    let heightPx = null;
    let topPx = null;
    let leftPx = null;
    const array = [];
    let elementDimensions = null;
    let adjElementDimensions = null;

    // Iterate through each element;
    _.each(iteratedElements, eachElement => {
      // Get dimensions in px for each element;
      elementDimensions = eachElement.getBoundingClientRect();
      // Get the id and index of each choice
      const elementId = eachElement.getAttribute('value').split(',')[0];
      elementIndex = parseInt(eachElement.getAttribute('value').split(',')[1], 10);
      // Get the parent template element from this.props.templateElements
      parentElement = templateElements[elementId];
      // Get the document_field_choice for eachElement
      choiceElement = parentElement.document_field_choices[elementIndex];
      // console.log('in create_edit_document, dragChoice, closeDragElement, eachElement, elementDimensions, otherChoicesObject, choiceButtonDimensions, wrapperDivDimensions, innerDiv, innerDivDimensions, backgroundDimensions: ', eachElement, elementDimensions, otherChoicesObject, choiceButtonDimensions, wrapperDivDimensions, innerDiv, innerDivDimensions, backgroundDimensions);
      // Get the values in percentages i.e. 5% NOT 0.05
      // Use original px values to avoid shrinking after each move
      if (elementIndex === choiceIndex) {
        top = `${((elementDimensions.top - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`
        left = `${((elementDimensions.left - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`
        width = `${(choiceButtonWidthInPx / backgroundDimensions.width) * 100}%`;
        height = `${(choiceButtonHeightInPx / backgroundDimensions.height) * 100}%`;
        widthPx = choiceButtonWidthInPx;
        heightPx = choiceButtonHeightInPx;
        topPx = elementDimensions.top;
        leftPx = elementDimensions.left;
        adjElementDimensions = {
          left: elementDimensions.left,
          top: elementDimensions.top,
          right: elementDimensions.left + choiceButtonWidthInPx,
          bottom: elementDimensions.top + choiceButtonHeightInPx,
          width: choiceButtonWidthInPx,
          height: choiceButtonHeightInPx
        };
      } else {
        top = `${((otherChoicesObject[elementIndex].topInPx - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`
        left = `${((otherChoicesObject[elementIndex].leftInPx - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`
        width = `${(otherChoicesObject[elementIndex].widthInPx / backgroundDimensions.width) * 100}%`;
        height = `${(otherChoicesObject[elementIndex].heightInPx / backgroundDimensions.height) * 100}%`;
        widthPx = otherChoicesObject[elementIndex].widthInPx;
        heightPx = otherChoicesObject[elementIndex].heightInPx;
        topPx = otherChoicesObject[elementIndex].originalTopInPx;
        leftPx = otherChoicesObject[elementIndex].originalLeftInPx;
        adjElementDimensions = {
          left: otherChoicesObject[elementIndex].leftInPx,
          top: otherChoicesObject[elementIndex].topInPx,
          right: otherChoicesObject[elementIndex].leftInPx + otherChoicesObject[elementIndex].widthInPx,
          bottom: otherChoicesObject[elementIndex].topInPx + otherChoicesObject[elementIndex].heightInPx,
          width: otherChoicesObject[elementIndex].widthInPx,
          height: otherChoicesObject[elementIndex].heightInPx
        };
      }
      // Get the choice into an object mapped { 0: choice, 1: choice ...}
      newDocumentFieldChoices[elementIndex] = { ...choiceElement, top, left, width, height, width_px: widthPx, height_px: heightPx, top_px: topPx, left_px: leftPx }
      oldDocumentFieldChoices[elementIndex] = choiceElement;
      array.push(adjElementDimensions);
    });

    return { array, newDocumentFieldChoices, oldDocumentFieldChoices };
  };
