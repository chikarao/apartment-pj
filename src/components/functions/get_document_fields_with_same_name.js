import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    documentFields,
    selectedFieldObject,
    valuesInForm,
    fromCreateEditDocument,
    initialValuesObject,
    translationModeOn
  } = props;
  console.log('in get_document_fields_with_same_name, props: ', props);

  const object = {};
  const controlObject = {};
  let fieldValue = null;
  let name = null;
  let differentValueCount = 0;
  // Go through each field in document to see if the name of the field
  // is in selectedFieldObject with fields selected by user
  _.each(documentFields, eachField => {
    name = eachField.custom_name ? eachField.custom_name : eachField.name
    // Keep track of multiple fields with the same name
    if (!controlObject[name]) {
      controlObject[name] = 1;
    } else {
      controlObject[name]++;
    }
    console.log('in get_document_fields_with_same_name, this.props.selectedFieldObject, eachField.name, controlObject[eachField.name]: ', selectedFieldObject, eachField.name, controlObject[eachField.name]);
    // selectedFieldObject is set in CreateEditDocument in case 'getFieldValues':
    // if from CreateEditDocument, user is trying to get all the original values
    // whereas from SelectExitingDocumentModal, user is trying to get eachField.value
    fieldValue = fromCreateEditDocument ? eachField.original_value : eachField.value;
    if (initialValuesObject) fieldValue = initialValuesObject[name]

    if (
      !eachField.translation_element
      &&
      // selectedFieldObject[eachField.name] // was selected by user
      fieldValue // documentField of document has a value
      // && eachField.value // documentField of document has a value
      // value is not the same as the current value of field in form props selected by user
      // && (eachField.value !== this.props.valuesInForm[eachField.name])
      && controlObject[name] <= 1 // test if not a repeat of documentField
    ) {
      // if pass test, place in object to be sent to action setGetFieldValueDocumentObject
      // object[eachField.name] = { fieldName: eachField.name, [eachField.name]: eachField.value, currentValue: this.props.selectedFieldObject[eachField.name].currentValue };
      // If value different from props form value, keep count
      if (fieldValue !== valuesInForm[name]) differentValueCount++;
      object[name] = {
        field: eachField,
        fieldName: eachField.name,
        [name]: fieldValue,
        currentValue: valuesInForm[name],
        sameValues: fieldValue === valuesInForm[name],
        customName: eachField.custom_name
      };
    }
  });

  console.log('in get_document_fields_with_same_name, return object: ', object);
  return { object, differentValueCount };
};
