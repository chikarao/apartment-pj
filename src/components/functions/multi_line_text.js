import React from 'react';
import _ from 'lodash';

// breaks text with reverse slash n into separate lines
export default (props) => {
  // console.log('in messaging, multi_line_text, props: ', props);
  const textArray = props.text.split('\n');
  // console.log('in messaging, multi_line_text, textArray: ', textArray);
  function renderEachLine() {
    return _.map(textArray, (eachLine, i) => {
      return <span key={i} >{eachLine}<br/></span>;
    });
  }

  return <div>{renderEachLine()}</div>;
};
