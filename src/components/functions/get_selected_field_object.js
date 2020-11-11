// import React from 'react';
import _ from 'lodash';

import getElementLabel from '../functions/get_element_label';

export default (props) => {
  const {
    selectedTemplateElementIdArray,
    templateElements,
    allDocumentObjects,
    documents,
    agreement,
    documentTranslationsAll,
    appLanguages,
    appLanguageCode,
    valuesInForm,
    // callback,
  } = props;
  console.log('in get_selected_field_object, props: ', props);

  const object = { fields: {}, customFieldExists: false };
  let name = null;
  let dBlinkPath = '';

  _.each(selectedTemplateElementIdArray, eachId => {
    name = templateElements[eachId].custom_name ? templateElements[eachId].custom_name : templateElements[eachId].name;
    dBlinkPath = '';

    if (templateElements[eachId].custom_name) {
      object.customFieldExists = true;
      dBlinkPath = templateElements[eachId].name
                    ?
                    getElementLabel({
                      allDocumentObjects,
                      documents,
                      agreement,
                      modifiedElement: templateElements[eachId],
                      fieldName: templateElements[eachId].name,
                      documentTranslationsAll,
                      appLanguages,
                      appLanguageCode,
                      fromCreateEditDocument: true
                    })
                    :
                    null;
    }

    object.fields[name] = {
      element: templateElements[eachId],
      currentValue: templateElements[eachId].custom_name
                    ?
                    valuesInForm[templateElements[eachId].custom_name]
                    :
                    valuesInForm[templateElements[eachId].name],
      customField: templateElements[eachId].custom_name,
      dBlinkPath
    };
  });
  // Call back to set getFieldValuesCompletedArray to true
  // callback();
  return _.isEmpty(object) ? null : object;
};
