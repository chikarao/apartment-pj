import React from 'react';
import _ from 'lodash';

export default (props) => {
  const {
    allDocumentObjects,
    documents,
    agreement,
    modifiedElement,
    documentTranslationsAll,
    appLanguages,
    appLanguageCode,
    fieldName,
    fromCreateEditDocument,
    translationModeOn,
    translationElement
  } = props;
  // console.log('in get_element_label, props, props.fieldName: ', props, props.fieldName);

  let label = '';
  let translationKey = '';
  let translationText = '';

  // translationModeOn is when user is creating a translation element
  const elementObject = !translationModeOn
                        ?
                        allDocumentObjects[documents[agreement.template_file_name].propsAllKey][fieldName]
                        :
                        allDocumentObjects[fieldName];

  if (elementObject && !translationModeOn) {
    translationKey = elementObject.translation_key;
    translationText = elementObject.translation_object ? 'Translation' : '';

    const documentTranslations = documentTranslationsAll[`${agreement.template_file_name}_all`][translationKey]
    // const appLanguages = appLanguages[translationKey];
    label = (documentTranslations ? documentTranslations.translations[appLanguageCode] : '')
            ||
            (appLanguages[translationKey] ? appLanguages[translationKey][appLanguageCode] : '');
    const category = (appLanguages[elementObject.category] ? `${appLanguages[elementObject.category][appLanguageCode]}/` : '');
    const group = (appLanguages[elementObject.group] ? `${appLanguages[elementObject.group][appLanguageCode]}/` : '');
    label = group ? category + group + label + ' ' + translationText : category + label + ' ' + translationText;
    // modifiedElement.name;
    // console.log('in create_edit_document, renderTemplateElements, eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], label: ', eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], label);
  } else if (elementObject && translationModeOn) {
    // for translation elements
    const category = (appLanguages[elementObject.category] ? `${appLanguages[elementObject.category][appLanguageCode]}/` : '');
    const group = (appLanguages[elementObject.group] ? `${appLanguages[elementObject.group][appLanguageCode]}/` : '');
    translationText = translationElement ? 'Translation' : '';
    label = fieldName;
    label = group
            ?
            category + group + label + ' ' + translationText
            :
            category + label + ' ' + translationText;
  } else {
    // console.log('in get_element_label, in else elementObject props, props.fieldName: ', props, props.fieldName);
    // If no object existins in fixed and important_points, must be a list element (e.g. amenities_list);
    // Get first part of name to get translation from appLanguages; last part to get
    const splitKey = fieldName.split('_');
    const category = modifiedElement.list_parameters ? `${appLanguages[modifiedElement.list_parameters.split(',')[2]][appLanguageCode]}/` : '';
    translationText = splitKey[splitKey.length - 1] === 'translation' ? 'Translation' : '';
    splitKey.splice(splitKey.length - 1, 1)[0];
    // console.log('in create_edit_document, renderTemplateElements, eachElement, splitKey: ', eachElement, splitKey);
    const keyText = appLanguages[splitKey[0]][appLanguageCode] || translationKey
    label = category + keyText + ' ' + translationText;
    // label = modifiedElement.name;
  }

  // console.log('in get_element_label, before return label: ', label);
  return label;
};
