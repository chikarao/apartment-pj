import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  UPDATE_DOCUMENT_ELEMENT_LOCALLY,
  DELETE_DOCUMENT_ELEMENT_LOCALLY,
  SET_CREATE_DOCUMENT_KEY,
  SET_INITIAL_VALUES_OBJECT,
  EDIT_HISTORY,
  EDIT_AGREEMENT_FIELDS,
  FETCH_DOCUMENT_TRANSLATION,
  SAVE_TEMPLATE_DOCUMENT_FIELDS
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {
  initialValuesObject: {},
  overlappedkeysMapped: {},
  allFields: [],
  editHistoryArray: [],
  dirtyObject: {},
  dirtyFieldExists: false,
  agreementMappedById: {},
  agreementMappedByName: {},
  documentTranslations: {},
  templateElements: {}
}, action) {
  // console.log('in documents reducer, action.payload: ', action.payload);
  const fontObject = { fontFamily: {}, fontSize: {}, fontStyle: {}, fontWeight: {} };

  function getElementFontAttributes(elements) {
    // Get a map of the attributes font family, size style and weight used
    // in the document
    console.log('in create_edit_document, getElementFontAttributes, elements: ', elements);
    // Go through each element and each of the keys in fontObject
    _.each(Object.keys(elements), eachElementKey => {
      // If the element is a text or string element place in object with an array with element ids
      if (elements[eachElementKey].type === 'text' || elements[eachElementKey].type === 'string') {
        console.log('in create_edit_document, getElementFontAttributes, eachElementKey: ', eachElementKey);
        _.each(Object.keys(fontObject), eachKey => {
          if (!fontObject[eachKey][elements[eachElementKey][eachKey]]) {
            fontObject[eachKey][elements[eachElementKey][eachKey]] = [elements[eachElementKey].id];
          } else {
            fontObject[eachKey][elements[eachElementKey][eachKey]].push(elements[eachElementKey].id);
          }
        });
      }
    });
    // Looks like { fontFamily: { arial: [1, 2, 3] }, fontSize: { 12px: [1, 2, 3] }... }
    return fontObject;
  }

  function getOnlyFontAttributes(object) {
    // Get the font attribute that is the only attribute for document
    const returnObject = {};
    _.each(Object.keys(fontObject), eachKey => {
      if (Object.keys(object[eachKey]).length === 1) {
        returnObject[eachKey] = Object.keys(object[eachKey])[0];
      } else {
        returnObject[eachKey] = null;
      }
    });
    return returnObject;
  }

  let fontAttributeObject = null;
  let onlyFontAttributeObject = null;

  switch (action.type) {

    case SAVE_TEMPLATE_DOCUMENT_FIELDS: {
      console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      // const newObject = {}
      // // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      // const mergedObject = _.merge(newObject, state.templateElements, { [action.payload.id]: action.payload });
      fontAttributeObject = getElementFontAttributes(action.payload.agreement.document_fields);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);
      // Temporary until another column 'action' added in backend !!!!
      _.each(action.payload.agreement.document_fields, eachElement => {
        eachElement.action = 'create'
      });

      return { ...state, templateElements: _.mapKeys(action.payload.agreement.document_fields, 'id'), fontAttributeObject, onlyFontAttributeObject };
    }

    case CREATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      const newObject = {}
      // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
      // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
      const mergedObject = _.merge(newObject, state.templateElements, { [action.payload.id]: action.payload });
      fontAttributeObject = getElementFontAttributes(mergedObject);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: mergedObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case DELETE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      // Get shallow copy of template elements in new object
      // Needs to be new object so redux will find a new updated state.
      const newDeleteObject = _.merge({}, state.templateElements);
      // iterate through each element id in action payload
      // and delete id: elementObj in state.templateElements (object)
      _.each(action.payload, (eachElementId) => {
        // delete key in templateElements copy object
        delete newDeleteObject[eachElementId]
      });

      fontAttributeObject = getElementFontAttributes(newDeleteObject);
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: newDeleteObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case UPDATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload: ', action.payload);
      // Get mapped array of action payload;
      // before: [{element}, {element}], after: { id: {element}, id: {element}}
      const actionPayloadMapped = _.mapKeys(action.payload, 'id')
      // get shallow copy of template elements
      const newUpdateObject = _.merge({}, state.templateElements);
      // Iterate through each of the elements in action payload
      _.each(Object.keys(actionPayloadMapped), eachElementId => {
        // Get the element in app state with the sent id
        const obj = state.templateElements[eachElementId];
        const newObj = {};
        // Iterate through each key in the element to be updated in app state
        _.each(Object.keys(obj), eachKey => {
          // if the key (eg width, height) is in element sent in action.payload
          if (eachKey in actionPayloadMapped[eachElementId]) {
            // update that key with the new value
            newObj[eachKey] = actionPayloadMapped[eachElementId][eachKey];
          } else {
            // else keep the same value to the key in element in app state
            newObj[eachKey] = obj[eachKey];
          }
        });
        // assign the new object to shallow copy of state.templateElements
        // Needs to be new object so redux will find a new updated state.
        // ie cannot be ...state.templateElements
        newUpdateObject[eachElementId] = newObj;
      }); // end of each Object.keys actionPayloadMapped

      fontAttributeObject = getElementFontAttributes(newUpdateObject)
      onlyFontAttributeObject = getOnlyFontAttributes(fontAttributeObject);

      return { ...state, templateElements: newUpdateObject, fontAttributeObject, onlyFontAttributeObject };
    }

    case SET_CREATE_DOCUMENT_KEY:
      // console.log('in documents reducer, state: ', state);
      return { ...state, createDocumentKey: action.payload };

    case SET_INITIAL_VALUES_OBJECT:
    // console.log('in documents reducer, action.payload: ', action.payload);
      return {
        ...state,
        initialValuesObject: action.payload.initialValuesObject,
        overlappedkeysMapped: action.payload.overlappedkeysMapped,
        allFields: action.payload.allFields,
        agreementMappedById: action.payload.agreementMappedById,
        agreementMappedByName: action.payload.agreementMappedByName,
        mainInsertFieldsObject: action.payload.mainInsertFieldsObject,
      };

    case EDIT_HISTORY:
    console.log('in reducer, case EDIT_HISTORY_ARRAY, action.payload: ', action.payload);
      let array = [...state.editHistoryArray];
      const object = { ...state.dirtyFields };
      if (action.payload.action == 'add') {
        array = [...state.editHistoryArray, action.payload.newEditHistoryItem];
      } else if (action.payload.action == 'clear') {
        array = [];
        // array = [];
      } else if (action.payload.action == 'flipDirtyField') {
        object[action.payload.name] = action.payload.dirty;
      }
      // else if (action.payload.action == 'dirtyFieldExists') {
      //   const count = action.payload.dirtyCount;
      // }
      return { ...state, editHistoryArray: array, dirtyObject: object };

    case EDIT_AGREEMENT_FIELDS:
    // console.log('in documents reducer, state: ', state);
    return { ...state, editHistoryArray: [] };

    case FETCH_DOCUMENT_TRANSLATION:
    // console.log('in documents reducer, fetch document translation action.payload: ', action.payload);
    return { ...state, documentTranslations: JSON.parse(action.payload) };

    default:
      return state;
  }
}
