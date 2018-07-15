// import React from 'react';

const searchCriteria = {
  0: { name: 'size', title: 'Floor Space', lowerState: 'floorSpaceMin', upperState: 'floorSpaceMax', lowerLabel: 'More than', upperLabel: 'Less than', units: '(sq m)', increment: 10, moreThanLimit: 0, lessThanLimit: 1000, maxMinAdjustment: 10, startMin: 0, startMax: 70, startBigMax: 10000 },
  1: { name: 'bedrooms', title: 'Bedrooms', lowerLabel: 'More than', upperLabel: 'Fewer than', units: '(rooms)', increment: 1, moreThanLimit: 0, lessThanLimit: 10, maxMinAdjustment: 0, startMin: 0, startMax: 1, startBigMax: 100},
  2: { name: 'station', title: 'Distance from Station', lowerLabel: 'More than', upperLabel: 'Less than', units: '(mins)', increment: 1, moreThanLimit: 0, lessThanLimit: 20, maxMinAdjustment: 10, startMin: 0, startMax: 7, startBigMax: 100 },
  3: { name: 'price', title: 'Price', lowerLabel: 'More than', upperLabel: 'Less than', units: '($)', increment: 500, moreThanLimit: 0, lessThanLimit: 10000, maxMinAdjustment: 100, startMin: 0, startMax: 2000, startBigMax: 100000000 }
}

export default searchCriteria;
