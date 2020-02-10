import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  UPDATE_DOCUMENT_ELEMENT_LOCALLY,
  DELETE_DOCUMENT_ELEMENT_LOCALLY,
  SET_CREATE_DOCUMENT_KEY,
  SET_INITIAL_VALUES_OBJECT,
  EDIT_HISTORY,
  EDIT_AGREEMENT_FIELDS,
  FETCH_DOCUMENT_TRANSLATION
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

  switch (action.type) {

    case CREATE_DOCUMENT_ELEMENT_LOCALLY:
    console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
    const newObject = {}
    // REFERENCE: https://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
    // Use lodash merge to get elements in mapped object { 1: {}, 2: {} }
    const mergedObject = _.merge(newObject, state.templateElements, { [action.payload.id]: action.payload });
      return { ...state, templateElements: mergedObject };

    case DELETE_DOCUMENT_ELEMENT_LOCALLY:
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
      return { ...state, templateElements: newDeleteObject };

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
      return { ...state, templateElements: newUpdateObject };
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
