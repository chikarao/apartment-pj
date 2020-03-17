// import React from 'react';
import _ from 'lodash';

export default (props) => {
  const { elementsArray, newWrapperDims } = props;
    let dimensionsObject = {};
    let highestTopInPx = 10000; // set at really high value so first lower will be selected
    let lowestBottomInPx = 0;
    let mostLeftInPx = 10000;
    let mostRightInPx = 0;

    _.each(elementsArray, elementDimensions => {
      highestTopInPx = highestTopInPx > elementDimensions.top ? elementDimensions.top - props.adjustmentPx : highestTopInPx;
      lowestBottomInPx = lowestBottomInPx < elementDimensions.bottom ? elementDimensions.bottom : lowestBottomInPx;
      mostLeftInPx = mostLeftInPx > elementDimensions.left ? elementDimensions.left - props.adjustmentPx : mostLeftInPx;
      mostRightInPx = mostRightInPx < elementDimensions.right ? elementDimensions.right : mostRightInPx;
    })

    dimensionsObject = {
      highestTopInPx,
      lowestBottomInPx,
      mostLeftInPx,
      mostRightInPx,
      top: `${((highestTopInPx - newWrapperDims.top) / newWrapperDims.height) * 100}%`,
      left: `${((mostLeftInPx - newWrapperDims.left) / newWrapperDims.width) * 100}%`,
      width: `${((mostRightInPx - mostLeftInPx) / newWrapperDims.width) * 100}%`,
      height: `${((lowestBottomInPx - highestTopInPx) / newWrapperDims.height) * 100}%`,
      topInPx: highestTopInPx,
      leftInPx: mostLeftInPx,
      widthInPx: mostRightInPx - mostLeftInPx,
      heightInPx: lowestBottomInPx - highestTopInPx,
    };

    return dimensionsObject;
  };
