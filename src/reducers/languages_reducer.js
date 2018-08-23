import _ from 'lodash';
import {
  CREATE_FLAT_LANGUAGE
} from '../actions/types';

export default function (state = { createdLanguage: {} }, action) {
  console.log('in language reducer, action.payload: ', action.payload);

  switch (action.type) {
    case CREATE_FLAT_LANGUAGE:
      return { ...state, createdLanguage: action.payload };

    default:
      return state;
  }
}
