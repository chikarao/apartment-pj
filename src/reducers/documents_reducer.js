import _ from 'lodash';
import {
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  SET_CREATE_DOCUMENT_KEY
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {}, action) {
  // console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case CREATE_DOCUMENT_ELEMENT_LOCALLY:
      // console.log('in booking reducer, state: ', state);
      return { ...state, newElement: action.payload };

    case SET_CREATE_DOCUMENT_KEY:
      // console.log('in booking reducer, state: ', state);
      return { ...state, createDocumentKey: action.payload };

    default:
      return state;
  }
}
