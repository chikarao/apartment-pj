import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  SET_CREATE_DOCUMENT_KEY,
  SET_INITIAL_VALUES_OBJECT,
  EDIT_HISTORY,
  EDIT_AGREEMENT_FIELDS
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {
  initialValuesObject: {},
  overlappedkeysMapped: {},
  allFields: [],
  editHistoryArray: [],
  dirtyObject: {},
  dirtyFieldExists: false,
}, action) {
  // console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case CREATE_DOCUMENT_ELEMENT_LOCALLY:
      // console.log('in booking reducer, state: ', state);
      return { ...state, newElement: action.payload };

    case SET_CREATE_DOCUMENT_KEY:
      // console.log('in booking reducer, state: ', state);
      return { ...state, createDocumentKey: action.payload };

    case SET_INITIAL_VALUES_OBJECT:
      return {
        ...state,
        initialValuesObject: action.payload.initialValuesObject,
        overlappedkeysMapped: action.payload.overlappedkeysMapped,
        allFields: action.payload.allFields,
        agreementMappedById: action.payload.agreementMappedById,
        agreementMappedByName: action.payload.agreementMappedByName,
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

    default:
      return state;
  }
}
