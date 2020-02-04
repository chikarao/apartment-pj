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
  templateElements: []
}, action) {
  // console.log('in documents reducer, action.payload: ', action.payload);

  switch (action.type) {

    case CREATE_DOCUMENT_ELEMENT_LOCALLY:
    console.log('in documents reducer, state, CREATE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
      return { ...state, templateElements: [...state.templateElements, action.payload] };

    case DELETE_DOCUMENT_ELEMENT_LOCALLY:
    console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, action.payload: ', action.payload);
    // console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, state.templateElements: ', state.templateElements);
      const newArrayDelete = [...state.templateElements]
      _.each(state.templateElements, (eachExisting, i) => {
        // console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, eachExisting: ', eachExisting);
        if (action.payload.includes(eachExisting.id)) {
          const indexDelete = newArrayDelete.indexOf(eachExisting.id, 1);
          newArrayDelete.splice(indexDelete, 1);
        }
      });
      // console.log('in documents reducer, state, DELETE_DOCUMENT_ELEMENT_LOCALLY, newArrayDelete: ', newArrayDelete);
      return { ...state, templateElements: newArrayDelete };

    case UPDATE_DOCUMENT_ELEMENT_LOCALLY: {
      console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY action.payload: ', action.payload);
      console.log('in documents reducer, state, UPDATE_DOCUMENT_ELEMENT_LOCALLY, state.templateElements: ', state.templateElements);
      let index = 0;
      let newArray = []
      function getUpdatedElement(element) {
        // console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY getUpdatedElement, element: ', element);
        let objectReturned = null;
        _.each(state.templateElements, (eachElement, i) => {
          if (eachElement.id == element.id ) {
            objectReturned = eachElement;
            index = i;
          }
        })
        // console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY objectReturned: ', objectReturned);
        return { objectReturned, index };
      }

      // const array = [...state.templateElements]
      _.each(action.payload, (eachElement, i) => {
        const obj = getUpdatedElement(eachElement)
        _.each(Object.keys(obj.objectReturned), eachKey => {
          if (eachKey in action.payload[i]) {
            obj.objectReturned[eachKey] = action.payload[i][eachKey];
          }
        })
        newArray = [...state.templateElements]
        newArray[index] = obj.objectReturned;
      })
      // console.log('in documents reducer, UPDATE_DOCUMENT_ELEMENT_LOCALLY updatedElement: ', updatedElement);
      return { ...state, templateElements: newArray };
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
