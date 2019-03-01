import _ from 'lodash';
import {
  SELECTED_DATES,
  REQUEST_BOOKING,
  FETCH_BOOKING,
  FETCH_BOOKINGS_BY_USER,
  FETCH_ICAL,
  REQUIRED_FIELDS,
  BOOKING_REQUEST_DATA,
  EDIT_BOOKING,
  CREATE_AGREEMENT,
  EDIT_AGREEMENT,
  EDIT_AGREEMENT_FIELDS,
  DELETE_AGREEMENT,
  CREATE_DOCUMENT_INSERT,
  EDIT_DOCUMENT_INSERT,
  DELETE_DOCUMENT_INSERT,
  CREATE_INSERT_FIELD,
  EDIT_INSERT_FIELD,
  DELETE_INSERT_FIELD,
  FETCH_AGREEMENT,
  EMAIL_DOCUMENTS
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {
  selectedBookingDates: { to: null, from: null },
  requiredFields: [],
  bookingRequestData: {},
  agreement: {}
}, action) {
  // console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case SELECTED_DATES:
      // console.log('in booking reducer, state: ', state);
      return { ...state, selectedBookingDates: action.payload };

    case REQUEST_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, bookingData: action.payload.booking };

    case FETCH_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking, user: action.payload.user, owner: action.payload.owner, flat: action.payload.flat, contracts: action.payload.contracts, assignments: action.payload.assignments, contractorTranslations: action.payload.contractorTranslations, staffTranslations: action.payload.staffTranslations };

    case CREATE_AGREEMENT:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking };

    case EDIT_AGREEMENT:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking };

    case EDIT_AGREEMENT_FIELDS:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking };

    case DELETE_AGREEMENT:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking };

    case FETCH_BOOKINGS_BY_USER:
      console.log('in booking reducer, FETCH_BOOKINGS_BY_USER, action.payload: ', action.payload);
      // return _.mapKeys(action.payload, 'id');
        // return _.mapKeys(action.payload, 'id');
      return { ...state, fetchBookingsByUserData: _.mapKeys(action.payload, 'id') };

    case FETCH_ICAL:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchedIcal: action.payload };

    case REQUIRED_FIELDS:
    // console.log('in booking reducer, state: ', state);
    return { ...state, requiredFields: action.payload };

    case BOOKING_REQUEST_DATA:
    // console.log('in booking reducer, BOOKING_REQUEST_DATA state, action.payload, state.bookingRequestData : ', state, action.payload, state.bookingRequestData);
    return { ...state, bookingRequestData: action.payload };

    case EDIT_BOOKING:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload };

    case CREATE_DOCUMENT_INSERT:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload };

    case EDIT_DOCUMENT_INSERT:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload };

    case DELETE_DOCUMENT_INSERT:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload };

    case CREATE_INSERT_FIELD:
    // console.log('in booking reducer, state: ', state);
    return { ...state, documentInserts: action.payload.document_inserts };

    case EDIT_INSERT_FIELD:

    // console.log('in booking reducer, state: ', state);
    return { ...state, documentInserts: action.payload.document_inserts };

    case DELETE_INSERT_FIELD:
    // console.log('in booking reducer, state: ', state);
    return { ...state, documentInserts: action.payload.document_inserts };

    case FETCH_AGREEMENT:
    // console.log('in booking reducer, state: ', state);

    // return { ...state, agreement: action.payload.agreement, documentInserts: action.payload.document_inserts  };
    return { ...state, documentInserts: action.payload.document_inserts };

    case EMAIL_DOCUMENTS:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload.booking };
    // case SELECTED_ICALENDAR_ID:
    // // console.log('in booking reducer, state: ', state);
    // return { ...state, selectedIcalendarId: action.payload };

    default:
      return state;
  }
}
