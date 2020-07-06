import _ from 'lodash';
import {
  CREATE_FLAT_LANGUAGE,
  SELECTED_LANGUAGE,
  UPDATE_FLAT_LANGUAGE,
  SET_APP_LANGUAGE_CODE,
  SET_DOCUMENT_LANGUAGE_CODE,
  PLACE_SEARCH_LANGUAGE,
} from '../actions/types';

export default function (state = {
  createdLanguage: {},
  appLanguageCode: 'en',
  documentLanguageCode: 'en',
  placeSearchLanguageCode: 'en' }, action) {

  switch (action.type) {
    case CREATE_FLAT_LANGUAGE:
      return { ...state, createdLanguage: action.payload };

    case SELECTED_LANGUAGE:
      return { ...state, selectedLanguage: action.payload };

    case UPDATE_FLAT_LANGUAGE:
      return { ...state, selectedLanguage: action.payload };

    case SET_APP_LANGUAGE_CODE:
    console.log('in language reducer, SET_APP_LANGUAGE_CODE state, action.payload: ', state, action.payload);
      return { ...state, appLanguageCode: action.payload };

    case SET_DOCUMENT_LANGUAGE_CODE:
    // Called first in index.js
    console.log('in language reducer, SET_DOCUMENT_LANGUAGE_CODE, action.payload: ', action.payload);
      return { ...state, documentLanguageCode: action.payload };

    case PLACE_SEARCH_LANGUAGE:
      return { ...state, placeSearchLanguageCode: action.payload };

    default:
      return state;
  }
}
