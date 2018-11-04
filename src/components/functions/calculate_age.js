import React from 'react';
import _ from 'lodash';

export default (props) => {
  console.log('in calculate_age, props: ', props);

  const today = new Date();
  const birthDate = new Date(props);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
// breaks text with reverse slash n into separate lines
// export default (props) => {
//   // console.log('in messaging, multi_line_text, props: ', props);
//   const textArray = props.text.split('\n');
//   // console.log('in messaging, multi_line_text, textArray: ', textArray);
//   function renderEachLine() {
//     return _.map(textArray, (eachLine, i) => {
//       return <span key={i} >{eachLine}<br/></span>;
//     });
//   }
//
//   return <div>{renderEachLine()}</div>;
// };
