// import React from 'react';
// import _ from 'lodash';

// *** This function used in getInitialValueObject and documentChoicesTemplate
export default (props) => {
 const { choices, value } = props;

 let returnObject = null;
 let modifiedValue = value;
 if (value === 't') modifiedValue = true;
 if (value === 'f') modifiedValue = false;
 if (choices[modifiedValue]) returnObject = choices[modifiedValue].translation;
 if (choices.inputFieldValue && choices.inputFieldValue.selectChoices) {
   returnObject = choices.inputFieldValue.selectChoices[modifiedValue];
 }

 console.log('get_field_value_translation, choices, value, returnObject', choices, value, returnObject);
 return returnObject;
};
