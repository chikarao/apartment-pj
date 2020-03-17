// import React from 'react';
// import _ from 'lodash';

export default (props) => {
  // const setBoundaries = (elementsArray, props.newWrapperDims, props.adjustmentPx) => {
  const {
    elementId,
    lastWrapperDivDims,
    backgroundDimensions,
    wrapperDivDimensions,
    tabHeight,
    newDocumentFieldChoices,
    oldDocumentFieldChoices 
  } = props;
  // let updatedElementObject = {};
  const updatedElementObject = {
    id: elementId,
    // new, updated dimensions
    top: `${((lastWrapperDivDims.topInPx - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`,
    left: `${((lastWrapperDivDims.leftInPx - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`,
    width: `${(lastWrapperDivDims.widthInPx / backgroundDimensions.width) * 100}%`,
    height: `${((lastWrapperDivDims.heightInPx) / backgroundDimensions.height) * 100}%`,

    // old, before updated dimensions
    o_top: `${((wrapperDivDimensions.top - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`,
    o_left: `${((wrapperDivDimensions.left - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`,
    o_width: `${(wrapperDivDimensions.width / backgroundDimensions.width) * 100}%`,
    o_height: `${((wrapperDivDimensions.height - tabHeight) / backgroundDimensions.height) * 100}%`,

    document_field_choices: newDocumentFieldChoices,
    o_document_field_choices: oldDocumentFieldChoices,
    action: 'update'
  };

  return updatedElementObject;
};
