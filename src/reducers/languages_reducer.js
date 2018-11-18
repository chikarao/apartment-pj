import _ from 'lodash';
import {
  CREATE_FLAT_LANGUAGE,
  SELECTED_LANGUAGE,
  UPDATE_FLAT_LANGUAGE,
  SET_APP_LANGUAGE_CODE,
  PLACE_SEARCH_LANGUAGE,
} from '../actions/types';

export default function (state = {
  createdLanguage: {},
  appLanguageCode: 'en',
  placeSearchLanguageCode: 'en' }, action) {
  // console.log('in language reducer, action.payload: ', action.payload);

  switch (action.type) {
    case CREATE_FLAT_LANGUAGE:
      return { ...state, createdLanguage: action.payload };

    case SELECTED_LANGUAGE:
      return { ...state, selectedLanguage: action.payload };

    case UPDATE_FLAT_LANGUAGE:
      return { ...state, selectedLanguage: action.payload };

    case SET_APP_LANGUAGE_CODE:
      return { ...state, appLanguageCode: action.payload };

    case PLACE_SEARCH_LANGUAGE:
      return { ...state, placeSearchLanguageCode: action.payload };

    default:
      return state;
  }
}
