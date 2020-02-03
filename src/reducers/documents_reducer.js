import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  UPDATE_DOCUMENT_ELEMENT_LOCALLY,
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
  templateElements: []
}, action) {
  // console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case CREATE_DOCUMENT_ELEMENT_LOCALLY:
    console.log('in booking reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, state.templateElements: ', state.templateElements);
    console.log('in booking reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      return { ...state, templateElements: [...state.templateElements, action.payload] };

    case UPDATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in booking reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload: ', action.payload);
      function getUpdatedElement(element) {
        // console.log('in booking reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY getUpdatedElement, element: ', element);

        let objectReturned = null;
        _.each(state.templateElements, eachElement => {
          if (eachElement.id == element.id ) {
            objectReturned = eachElement;
          }
        })
        // console.log('in booking reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY objectReturned: ', objectReturned);
        return objectReturned;
      }

      // const array = [...state.templateElements]
      const updatedElement = getUpdatedElement(action.payload)
      // console.log('in booking reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY updatedElement: ', updatedElement);
      _.each(Object.keys(updatedElement), eachKey => {
        if (eachKey in action.payload) {
          updatedElement[eachKey] = action.payload[eachKey];
        }
      })
      console.log('in booking reducer, state, UPDATE_DOCUMENT_ELEMENT_LOCALLY, state.templateElements: ', state.templateElements);
      return { ...state, templateElements: state.templateElements };
    }

    case SET_CREATE_DOCUMENT_KEY:
      // console.log('in booking reducer, state: ', state);
      return { ...state, createDocumentKey: action.payload };

    case SET_INITIAL_VALUES_OBJECT:
    // console.log('in booking reducer, action.payload: ', action.payload);
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
    // console.log('in booking reducer, state: ', state);
    return { ...state, editHistoryArray: [] };

    case FETCH_DOCUMENT_TRANSLATION:
    // console.log('in booking reducer, fetch document translation action.payload: ', action.payload);
    return { ...state, documentTranslations: JSON.parse(action.payload) };

    default:
      return state;
  }
}
