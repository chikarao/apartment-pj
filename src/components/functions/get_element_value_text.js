import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    allDocumentObjects,
    documentConstants,
    eachFieldObject,
    documents,
    agreement,
    appLanguages,
    appLanguageCode,
    // fromCreateEditDocument,
    fieldValue
  } = props;
  console.log('in get_element_value_text, props: ', props);

  const getAmenitiesValue = (object) => {
    const convertedValue = eachFieldObject[eachFieldObject.fieldName] === 't' ? 0 : 1;
    return object[eachFieldObject.fieldName].choices[convertedValue][appLanguageCode];
  };

  const getBuildingValue = (object) => {
    // const convertedValue = eachFieldObject[eachFieldObject.fieldName] === 't' ? 0 : 1;
    return object[eachFieldObject.fieldName].choices[eachFieldObject[eachFieldObject.fieldName]][appLanguageCode];
  };

  let valueText = '';

  const elementObject = allDocumentObjects[documents[agreement.template_file_name].propsAllKey][eachFieldObject.fieldName];
  if (elementObject) {
    const groupObject = documentConstants[elementObject.group];
    const categoryObject = documentConstants[elementObject.category];
    valueText = fieldValue;
    if (elementObject.group === 'amenities') valueText = getAmenitiesValue(groupObject);
    if (elementObject.category === 'building') valueText = getBuildingValue(categoryObject);
    // const documentTranslations = documentTranslationsAll[`${agreement.template_file_name}_all`][translationKey]
    // const appLanguages = appLanguages[translationKey];
    // valueText = (documentTranslations ? documentTranslations.translations[appLanguageCode] : '')
    //         ||
    //         (appLanguages[translationKey] ? appLanguages[translationKey][appLanguageCode] : '');
    // const category = (appLanguages[elementObject.category] ? `${appLanguages[elementObject.category][appLanguageCode]}/` : '');
    // const group = (appLanguages[elementObject.group] ? `${appLanguages[elementObject.group][appLanguageCode]}/` : '');
    // valueText = group ? category + group + valueText + ' ' + translationText : category + valueText + ' ' + translationText;
    // console.log('in get_element_value_text, eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], valueText: ', eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], valueText);
  } else {
    // If there is no elementObject in allDocumentObjects, just return the raw data for value
    valueText = fieldValue;
    // valueText = modifiedElement.name;
  }

  return valueText;
};
