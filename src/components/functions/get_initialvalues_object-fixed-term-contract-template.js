import React from 'react';
import _ from 'lodash';
import RentPayment from '../constants/rent_payment';
import Facility from '../constants/facility';
import Tenants from '../constants/tenants';
import Documents from '../constants/documents';
import getBookingDateObject from './get_booking_date_object';
import getContractLength from './get_contract_length';

// fixed_term_rental_contract.js
export default (props) => {
  const { flat, booking, userOwner, tenant, appLanguageCode, documentFields, agreement, documentKey, documentLanguageCode, contractorTranslations, staffTranslations, template, allObject } = props;

  function getProfile(personProfiles, language) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, userOwner: ', userOwner);
    let returnedProfile = {};
    _.each(personProfiles, eachProfile => {
      if (eachProfile.language_code == language) {
        returnedProfile = eachProfile;
        return;
      }
    });
    return returnedProfile;
  }

  function getManagement(contractorArray, language, contractorType) {
    let returnedProfile = {};
    _.each(contractorArray, eachContractor => {
      _.each(eachContractor, each => {
        if ((each.language_code == language) && (each.contractor_type == contractorType)) {
          returnedProfile = each;
          return;
        }
      });
    });
    return returnedProfile;
  }


  function getContractEndNoticePeriodObject(booking) {
    // const daysInMonth = {
    //   0: 31,
    //   1: 28,
    //   2: 31,
    //   4: 30,
    //   5: 31,
    //   6: 30,
    //   7: 31,
    //   8: 31,
    //   9: 30,
    //   10: 31,
    //   11: 30,
    //   12: 31
    // };

    // const leapYearDay = 29;
    //
    // const leapYears = [2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108, 2112, 2116, 2120]
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, booking: ', booking);
    const dateEndOneYear = new Date(booking.date_end);
    const dateEndSixMonths = new Date(booking.date_end);
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
    const oneYearBefore = new Date(dateEndOneYear.setFullYear(dateEndOneYear.getFullYear() - 1));
    const sixMonthsBefore = new Date(dateEndSixMonths.setMonth(dateEndSixMonths.getMonth() - 6));
    const oneYearBeforeDay = oneYearBefore.getDate() == (0 || 1) ? 30 : oneYearBefore.getDate() - 1;
    const sixMonthsBeforeDay = sixMonthsBefore.getDate() == (0 || 1) ? 30 : sixMonthsBefore.getDate() - 1;
    const oneYearBeforeMonth = oneYearBefore.getDate() == (0 || 1) ? oneYearBefore.getMonth() : oneYearBefore.getMonth() + 1;
    const sixMonthsBeforeMonth = sixMonthsBefore.getDate() == (0 || 1) ? sixMonthsBefore.getMonth() : sixMonthsBefore.getMonth() + 1;
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, oneYearBefore: ', oneYearBefore.getFullYear(), oneYearBefore.getMonth() + 1, oneYearBefore.getDate() - 1);
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore.getFullYear(), sixMonthsBefore.getMonth(), sixMonthsBefore.getDate());
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore);
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);

    const noticeObject = { from: { year: oneYearBefore.getFullYear(), month: oneYearBeforeMonth, day: oneYearBeforeDay }, to: { year: sixMonthsBefore.getFullYear(), month: sixMonthsBeforeMonth, day: sixMonthsBeforeDay }}
    return noticeObject;
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, noticeObject: ', noticeObject);
  }

  function createAddress(flat) {
    let addressFieldArray = [];
    console.log('in get_initialvalues_object-fixed-term-contract, createAddress, flat: ', flat);
    // if (flat.country.toLowerCase() == ('usa' || 'united states of america' || 'us' || 'united states')) {
    // change order of address depending on country
    if (flat.country && flat.country.toLowerCase() == ('japan' || '日本' || '日本国' || 'japon')) {
      addressFieldArray = ['zip', 'state', 'city', 'address2', 'address1'];
    } else {
      addressFieldArray = ['address1', 'address2', 'city', 'state', 'zip'];
    }
    // const address = '';
    const addressArray = [];
    _.each(addressFieldArray, each => {
      // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, address: ', address);
      // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, each, type of flat[each]: ', each, typeof flat[each]);
      if ((typeof flat[each]) == 'string') {
        // const addressString = address.concat(toString(flat[each]));
        addressArray.push(flat[each])
      }
    });
    const address = addressArray.join(', ')
    // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, address: ', address);
    return address;
  }

  function getChoice(facility) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getChoice, facility: ', facility);
    const array = [];
    _.each(Facility.facility_type.choices, eachChoice => {
      if (eachChoice.value == facility.facility_type) {
        array.push(eachChoice);
        return;
      }
    });
    // returns the choice in facility.js facility_type object
    return array[0];
  }

  function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getLanguage(languages, languageCode) {
    let objectReturned = {};
    _.each(languages, eachLanguage => {
      console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage languages, languageCode: ', languages, languageCode);
      if (eachLanguage.language_code === languageCode) {
        objectReturned = eachLanguage;
        return;
      }
    });
    console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage objectReturned: ', objectReturned);
    return objectReturned;
  }

  function setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned }) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned: ', baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned);
    if (baseRecord.language_code === Documents[documentKey].baseLanguage) {
      // get building language for use translated field;
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = Documents base recordLanguage, documentLanguageCode: ', recordLanguage, documentLanguageCode);
      // assign buildingLanguage value to translated field
      objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      objectReturned[eachFieldKey] = baseRecord[eachPageObject[eachFieldKey].translation_column];
    } else if (baseRecord.language_code === documentLanguageCode) {
      // if building language code is different from base language for document
      // give translated field the baseRecord value
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]);
      objectReturned[eachPageObject[eachFieldKey].translation_field] = baseRecord[eachPageObject[eachFieldKey].translation_column];
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode recordLanguage, Documents[documentKey].baseLanguage: ', recordLanguage, Documents[documentKey].baseLanguage);
      if (!_.isEmpty(recordLanguage)) {
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]);
        objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      }
    } else {
      // baseRecord languge is neither the document's baselanguage nor the
      // documentLanguageCode selected by the user, so need to look in translations
      // e.g. flat and flat_languages
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      const recordLanguage1 = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage else recordLanguage, recordLanguage1: ', recordLanguage, recordLanguage1);
      // if document is a translated/biligual document assign both
      if (Documents[documentKey].translation) {
        objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
        objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
      } else {
        // if not a translated document, assign one that corresponds to the selected document language code
        if (documentLanguageCode === recordLanguage.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
        if (documentLanguageCode === recordLanguage1.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
        // if (documentLanguageCode === recordLanguage.language_code) objectReturned[eachFieldKey] = recordLanguage[eachFieldKey];
        // if (documentLanguageCode === recordLanguage1.language_code) objectReturned[eachFieldKey] = recordLanguage1[eachFieldKey];
      }
    }
  }

  const buildingMethod = (p) => {
    return flat.building[p.key];
    // return { ...objectReturned, [p.key]: flat.building[p.key] };
  };

  const flatMethod = (p) => {
    return flat[p.key];
    // return { ...objectReturned, [p.key]: flat.building[p.key] };
  };
    // object to return to create_edit_document.js

  const methodObject = {
    building: {
      method: buildingMethod,
      parameters: {},
      condition: flat.building
    },

    flat: {
      method: flatMethod,
      parameters: {},
      condition: flat
    },

    amenities: {
      method: (p) => {
        return flat.amenity[p.key];
      },
      parameters: {},
      condition: flat.amenity
    },
  };

  let objectReturned = {};
  // object to be used in handleFormSubmit
  const allFields = {};
  // let eachField = null;
  let allObjectEach = null;
  let keyExistsInMethodObject = false;
  let eachConditionTrue = false;

  if (template) {
    // let objectReturnedSub = {}
    _.each(documentFields, eachField => {
      allObjectEach = allObject[eachField.name];
      // eachField = documentFields[eachFieldKey];
      keyExistsInMethodObject = allObjectEach
                                && methodObject[allObjectEach.initialValuesMethodKey];
      eachConditionTrue = allObjectEach
                          && methodObject[allObjectEach.initialValuesMethodKey]
                          && methodObject[allObjectEach.initialValuesMethodKey].condition;

      if (keyExistsInMethodObject && eachConditionTrue) {
        objectReturned = { ...objectReturned, [eachField.name]: methodObject[allObjectEach.initialValuesMethodKey].method({ ...methodObject.parameters, key: eachField.name }) };
      }
      console.log('in get_initialvalues_object-fixed-term-contract-template, getInitialValuesObject, documentFields, eachField, allObjectEach, allObject: ', documentFields, eachField, allObjectEach, allObject);
    });
  } else {

  }
  // !!!!!!!!!end of documentForm eachField

  console.log('in get_initialvalues_object-fixed-term-contract-template, getInitialValuesObject, objectReturned: ', objectReturned);
  // return objectReturned for assignment to initialValues in mapStateToProps
  return { initialValuesObject: objectReturned, allFields };
// }
};
