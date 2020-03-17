// import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    wrapperDiv,
    wrapperDivDimensions, 
    otherChoicesArray,
    templateElements,
    backgroundDimensions,
  } = props;

  const otherChoicesObject = {};

  let otherIndex = null;
  let eachOtherDims = null;
  let eachOtherInState = null;
  const elementId = wrapperDiv.getAttribute('id').split('-')[2];
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

    return otherChoicesObject;
  };
