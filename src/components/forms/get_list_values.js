import _ from 'lodash';

export default (props) => {
  const { listElement, flat, templateMappingObjects, agreements, documentLanguageCode, inspections } = props;
  // documentLanguageCode is the current translated language; the base language is in agreement.language_code
  // listModelsObject category is the first tier key in templateMappingObject
  const listModelsObject = {
                              amenities: { record: flat.amenity, category: 'flat', testValue: true },
                              inspectedparts: { record: inspections[Object.keys(inspections)[0]], category: 'inspection', testValue: 'yes' }
                            };
  // list_parameters assignment just for now; Take out later when passing real list element
  // listElement.list_parameters = 'fixed_term_rental_contract_bilingual,en,amenities,true,ac,auto_lock,bath_tub,cable_tv'
  const agreement = agreements.filter(agr => agr.id === listElement.agreement_id)[0];
  let count = 0;

  const getBaseObject = (modelName, object) => {
    // console.log('in get_list_values, getBaseObject, at top getBase, modelName, object: ', modelName, object);
    let returnObject = null;
    const getBase = (currentObj) => {
      Object.keys(currentObj).some(eachKey => {
        count++;
          // console.log('in get_list_values, getBaseObject, getBase, currentObj, eachKey, currentObj[eachKey], count: ', currentObj, eachKey, currentObj[eachKey], count);
          if (eachKey.toLowerCase() === modelName) {
            returnObject = currentObj[eachKey];
            return returnObject;
          }

          if (!currentObj[eachKey].component) {
            getBase(currentObj[eachKey]);
          }
      });
      return returnObject;
    };
    return getBase(object);
  };

  let object = null;
  // list_parameters looks like fixed_term_rental_contract_bilingual,base,amenities,true,ac,auto_lock,parcel_box
  const splitListParameters = listElement.list_parameters.split(',')
  const templateFileName = splitListParameters[0];
  const baseOrTranslation = splitListParameters[1];
  // console.log('in get_list_values, listElement, flat, splitListParameters, agreements, agreement: ', listElement, flat, splitListParameters, agreements, agreement);
  const languageCode = baseOrTranslation === 'base' ? agreement.language_code : documentLanguageCode;
  // const languageCode = 'en'
  // const languageCode = 'en';
  // modelName such as amenities
  const modelName = splitListParameters[2];
  let listBoolValue = splitListParameters[3] === 'true';
  console.log('in get_list_values, just listElement, modelName: ', listElement, modelName);
  // patch for yes/no in inspectedparts
  listBoolValue = modelName === 'inspectedparts' && listBoolValue === true ? 'yes' : listBoolValue;
  const listArray = splitListParameters.slice(4);
  let eachMappedObject = null;
  // baseObject is like amenties: { ac: object, parcel_box: object }
  const baseObject = getBaseObject(modelName, templateMappingObjects[templateFileName][listModelsObject[modelName].category]);
  let string = '';
  let str = '';
  const listArrayLength = listArray.length;
  // listModel is object like amenties = { ac: true, auto_lock: true, kitchen_stove: false, parcel_box: true }
  const listModel = listModelsObject[modelName].record;
  // console.log('in get_list_values, listElement, flat, splitListParameters, templateFileName, agreement, baseOrTranslation, languageCode, modelName, listBoolValue, listArray, templateMappingObjects, baseObject, listModel: ', listElement, flat, splitListParameters, templateFileName, agreement, baseOrTranslation, languageCode, modelName, listBoolValue, listArray, templateMappingObjects, baseObject, listModel);
  console.log('in get_list_values, listElement, listModel, listModelsObject[modelName].record, listArray, listBoolValue, baseObject: ', listElement, listModel, listModelsObject[modelName].record, listArray, listBoolValue, baseObject);
  // Iterate through list  of eachListItem e.g. [ac, auto_lock, parce_box]
  _.each(listArray, (eachListItem, i) => {
    if (eachListItem && listModel[eachListItem] === listBoolValue) {
      eachMappedObject = baseObject[eachListItem];
      str = `${eachMappedObject.translation[languageCode]}`
      // Put a comma except for last
      if ((listArrayLength > 1 && i === 0) || i < listArrayLength - 1) str = `${eachMappedObject.translation[languageCode]}, `
      string = string.concat(str)
    }
    // console.log('in get_list_values, eachListItem, eachMappedObject, listModel, eachMappedObject.translation[languageCode], eachMappedObject.translation, languageCode, string : ', eachListItem, eachMappedObject, listModel, eachMappedObject.translation[languageCode], eachMappedObject.translation, languageCode, string);
  })

  return string;
}
