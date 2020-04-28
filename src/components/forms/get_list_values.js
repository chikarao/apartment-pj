import _ from 'lodash';

export default (props) => {
  const { listElement, flat, templateMappingObjects } = props;
  const listModelsObject = { amenities: flat.amenity };
  // list_parameters assignment just for now; Take out later when passing real list element
  // listElement.list_parameters = 'fixed_term_rental_contract_bilingual,en,amenities,true,ac,auto_lock,bath_tub,cable_tv'

  const getMappedObject = (itemName, modelName) => {
    let currentObject = templateMappingObjects;
    let returnObject = null;
  };

  let count = 0;

  const getBaseObject = (modelName, object) => {
    let returnObject = null;
    const getBase = (currentObj) => {
      Object.keys(currentObj).some(eachKey => {
        count++;
          console.log('in get_list_values, getBaseObject, getBase, currentObj, eachKey, currentObj[eachKey], count: ', currentObj, eachKey, currentObj[eachKey], count);
          if (eachKey === modelName) {
            returnObject = currentObj[eachKey];
            return returnObject;
          }

          if (!currentObj[eachKey].component) {
            getBase(currentObj[eachKey]);
          }
      });
    // const getBase = (currentObj) => {
    //   _.each(Object.keys(currentObj), eachKey => {
    //     count++;
    //     console.log('in get_list_values, getBaseObject, getBase, currentObj, eachKey, currentObj[eachKey], count: ', currentObj, eachKey, currentObj[eachKey], count);
    //     if (!currentObj[eachKey].component) {
    //       getBase(currentObj[eachKey]);
    //     }
    //     if (eachKey === modelName) {
    //       returnObject = currentObj[eachKey];
    //       return;
    //     }
    //   });
      return returnObject;
    };
    return getBase(object);
  };

  let object = null;
  const splitListParameters = listElement.list_parameters.split(',')
  const templateFileName = splitListParameters[0];
  const languageCode = splitListParameters[1];
  // const languageCode = 'en';
  const modelName = splitListParameters[2];
  const listBoolValue = splitListParameters[3] === 'true';
  const listArray = splitListParameters.slice(4);
  let eachMappedObject = null;
  const baseObject = getBaseObject(modelName, templateMappingObjects[templateFileName]);
  console.log('in get_list_values, listElement, flat, splitListParameters, templateFileName, languageCode, modelName, listBoolValue, listArray, templateMappingObjects, baseObject : ', listElement, flat, splitListParameters, templateFileName, languageCode, modelName, listBoolValue, listArray, templateMappingObjects, baseObject);
  let string = '';
  let str = '';
  const listArrayLength = listArray.length;
  let listModel = listModelsObject[modelName]
  _.each(listArray, (eachListItem, i) => {
    if (eachListItem && listModel[eachListItem]) {
      eachMappedObject = baseObject[eachListItem];
      str = `${eachMappedObject.translation[languageCode]}`
      if (i === 0 || i < listArrayLength - 1) str = `${eachMappedObject.translation[languageCode]}, `
      string = string.concat(str)
    }
    console.log('in get_list_values, eachListItem, eachMappedObject, listModel, eachMappedObject.translation[languageCode], eachMappedObject.translation, languageCode, string : ', eachListItem, eachMappedObject, listModel, eachMappedObject.translation[languageCode], eachMappedObject.translation, languageCode, string);
  })

  return string;
}
