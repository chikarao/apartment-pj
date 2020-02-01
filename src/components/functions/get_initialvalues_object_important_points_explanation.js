import React from 'react';
import _ from 'lodash';
import RentPayment from '../constants/rent_payment';
import Facility from '../constants/facility';
import Tenants from '../constants/tenants';
import Building from '../constants/building';
import Documents from '../constants/documents';
// imported constants are upper camel case
// imported functions are lower camel case
import getBookingDateObject from './get_booking_date_object';
import getContractLength from './get_contract_length';


// get_initialvalues_object_important_points_explanation.js
export default (props) => {
  //function called in mapStateToProps of create_edit_document.js
  // destructure from props assigned in mapStateToProps
  // console.log('in get_initialvalues_object-fixed-term-contract, just this: ');
  const { flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentKey, documentLanguageCode, contractorTranslations, staffTranslations, mainInsertFieldsObject } = props;
  function getProfile(personProfiles, language) {
    let returnedProfile;
    _.each(personProfiles, eachProfile => {
      if (eachProfile.language_code == language) {
        returnedProfile = eachProfile;
      }
    });
    return returnedProfile;
  }
  // takes booking and creates object of start date and end date years, months and days
  // function getBookingDateObject() {
  //   // console.log('in create_edit_document, getBookingDateObject, booking: ', booking);
  //   const bookingEndArray = booking.date_end.split('-')
  //   const bookingStartArray = booking.date_start.split('-')
  //   const to_year = bookingEndArray[0];
  //   const to_month = bookingEndArray[1];
  //   const to_day = bookingEndArray[2];
  //   const from_year = bookingStartArray[0];
  //   const from_month = bookingStartArray[1];
  //   const from_day = bookingStartArray[2];
  //   // console.log('in create_edit_document, getBookingDateObject, bookingEndArray: ', bookingEndArray);
  //   const object = { to_year, to_month, to_day, from_year, from_month, from_day }
  //   // console.log('in create_edit_document, getBookingDateObject, object: ', object);
  //   return object;
  // }

  // function getContractLength() {
  //   // console.log('in create_edit_document, getContractLength, booking: ', booking);
  //   const dateFrom = new Date(booking.date_start);
  //   const dateTo = new Date(booking.date_end);
  //   const difference = Math.floor(dateTo - dateFrom);
  //   const day = 1000 * 60 * 60 * 24;
  //   const days = Math.floor(difference / day);
  //   const months = days / 30;
  //   let years = months / 12;
  //   if (years < 1) {
  //     years = '';
  //   } else if (years > 1 && years < 2) {
  //     years = 1;
  //   } else if (years >   2 && years < 3) {
  //     years = 2;
  //   }
  //   // console.log('in create_edit_document, getContractLength, months, years: ', months, years);
  //   const object = { months, years };
  //   // console.log('in create_edit_document, getContractLength, object: ', object);
  //   return object;
  // }

  // function getContractEndNoticePeriodObject() {
  //   // const daysInMonth = {
  //   //   0: 31,
  //   //   1: 28,
  //   //   2: 31,
  //   //   4: 30,
  //   //   5: 31,
  //   //   6: 30,
  //   //   7: 31,
  //   //   8: 31,
  //   //   9: 30,
  //   //   10: 31,
  //   //   11: 30,
  //   //   12: 31
  //   // };
  //
  //   // const leapYearDay = 29;
  //   //
  //   // const leapYears = [2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108, 2112, 2116, 2120]
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, booking: ', booking);
  //   const dateEndOneYear = new Date(booking.date_end);
  //   const dateEndSixMonths = new Date(booking.date_end);
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
  //   const oneYearBefore = new Date(dateEndOneYear.setFullYear(dateEndOneYear.getFullYear() - 1));
  //   const sixMonthsBefore = new Date(dateEndSixMonths.setMonth(dateEndSixMonths.getMonth() - 6));
  //   const oneYearBeforeDay = oneYearBefore.getDate() == (0 || 1) ? 30 : oneYearBefore.getDate() - 1;
  //   const sixMonthsBeforeDay = sixMonthsBefore.getDate() == (0 || 1) ? 30 : sixMonthsBefore.getDate() - 1;
  //   const oneYearBeforeMonth = oneYearBefore.getDate() == (0 || 1) ? oneYearBefore.getMonth() : oneYearBefore.getMonth() + 1;
  //   const sixMonthsBeforeMonth = sixMonthsBefore.getDate() == (0 || 1) ? sixMonthsBefore.getMonth() : sixMonthsBefore.getMonth() + 1;
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, oneYearBefore: ', oneYearBefore.getFullYear(), oneYearBefore.getMonth() + 1, oneYearBefore.getDate() - 1);
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore.getFullYear(), sixMonthsBefore.getMonth(), sixMonthsBefore.getDate());
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore);
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
  //
  //   const noticeObject = { from: { year: oneYearBefore.getFullYear(), month: oneYearBeforeMonth, day: oneYearBeforeDay }, to: { year: sixMonthsBefore.getFullYear(), month: sixMonthsBeforeMonth, day: sixMonthsBeforeDay }}
  //   return noticeObject;
  //   // console.log('in create_edit_document, getContractEndNoticePeriodObject, noticeObject: ', noticeObject);
  // }

  function createAddress(subjectObject) {
    console.log('in get_initialvalues_object_important_points_explanation, subjectObject: ', subjectObject);
    let addressFieldArray = [];
    // if (flat.country.toLowerCase() == ('usa' || 'united states of america' || 'us' || 'united states')) {
    // change order of address depending on country
    const country = subjectObject.country ? subjectObject.country.toLowerCase() : '';
    function readIntoArray() {
      const addressArray = [];
      _.each(addressFieldArray, each => {
        // console.log('in create_edit_document, createAddress, address: ', address);
        // console.log('in create_edit_document, createAddress, each, type of flat[each]: ', each, typeof flat[each]);
        if ((typeof subjectObject[each]) == 'string') {
          // const addressString = address.concat(toString(flat[each]));
          addressArray.push(subjectObject[each])
        }
      });
      return addressArray;
    }
    let address = {};
    if (country == 'japan' || country == '日本' || country == '日本国' || country == 'japon') {
      addressFieldArray = ['zip', 'state', 'city', 'address2', 'address1'];
      const addressArray = readIntoArray(addressFieldArray);
      address = addressArray.join(' ')
    } else {
      addressFieldArray = ['address1', 'address2', 'city', 'state', 'zip'];
      const addressArray = readIntoArray(addressFieldArray);
      address = addressArray.join(', ')
    }
    // const address = '';
    // console.log('in create_edit_document, createAddress, address: ', address);
    // console.log('in get_initialvalues_object_important_points_explanation, address: ', address);
    return address;
  }

  function formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }

  function formatDateForForm(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  // function getChoice(facility) {
  //   const array = [];
  //   _.each(Facility.facility_type.choices, eachChoice => {
  //     if (eachChoice.value == facility.facility_type) {
  //       array.push(eachChoice);
  //       return;
  //     }
  //   });
  //   // returns the choice in facility.js facility_type object
  //   return array[0];
  // }
  //
  // function calculateAge(dateString) {
  //     const today = new Date();
  //     const birthDate = new Date(dateString);
  //     let age = today.getFullYear() - birthDate.getFullYear();
  //     const m = today.getMonth() - birthDate.getMonth();
  //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //       age--;
  //     }
  //
  //     return age;
  // }

  function getContractor(workType) {
    let returnedContractor = {};
    _.each(contracts, eachContract => {
      if (eachContract.work_type == workType) {
        returnedContractor = eachContract.contractor;
      }
    });
    return returnedContractor;
  }

  function getStaff({ rentalAssignments, leader }) {
    let returnedStaff;
    _.each(rentalAssignments, eachAssignment => {
      // console.log('in get_initialvalues_object_important_points_explanation, eachAssignment, eachAssignment[leader], leader: ', eachAssignment, eachAssignment[leader], leader);
      if (eachAssignment.leader == leader) {
        returnedStaff = eachAssignment.staff;
      }
    });
    // console.log('in get_initialvalues_object_important_points_explanation, returnedStaff: ', returnedStaff);
    return returnedStaff;
  }

  function getContract(workType) {
    let returnedContract = {};
    _.each(contracts, eachContract => {
      console.log('in get_initialvalues_object_important_points_explanation, eachContract: ', eachContract);
      if (eachContract.work_type == workType) {
        returnedContract = eachContract;
      }
    });
    return returnedContract;
  }

  function getChoice(choices, value) {
    console.log('in get_initialvalues_object_important_points_explanation, choices, value: ', choices, value);
    let returnedChoice;
    _.each(choices, eachChoice => {
      if (eachChoice.val == value) {
        returnedChoice = eachChoice
      }
    })
    return returnedChoice;
  }

  function getInspection(inspections, language) {
    // console.log('in get_initialvalues_object_important_points_explanation, sortedInspections, inspectionReturned, eachInspection.language_code, documentLanguageCode: ', sortedInspections, inspectionReturned, eachInspection.language_code, documentLanguageCode);
    const sortedInspections = inspections.sort((a, b) => {
      return a.inspection_date - b.inspection_date;
    });
    console.log('in get_initialvalues_object_important_points_explanation, inspections, sortedInspections, documentLanguageCode: ', inspections, sortedInspections, documentLanguageCode);
    let inspectionReturned = {};
    _.each(sortedInspections, eachInspection => {
      if (eachInspection.language_code == language) {
        inspectionReturned = eachInspection;
        // console.log('in get_initialvalues_object_important_points_explanation, sortedInspections, inspectionReturned, eachInspection.language_code, documentLanguageCode: ', sortedInspections, inspectionReturned, eachInspection.language_code, documentLanguageCode);
        return;
      }
    });
    return inspectionReturned;
  }

  function getAmenityInput(amenityKey) {
    if (flat.amenity[amenityKey]) {
      return '有り'
    }　else {
      return '無し'
    }
  }

  function getOverlappedkeysMapped() {
    const object = {};
    _.each(documentFields, eachPageObject => {
      _.each(Object.keys(eachPageObject), eachKey => {
        // const baseKey = eachPageObject[eachKey].baseKey;
        if (eachPageObject[eachKey].baseKey) {
          const baseKey = eachPageObject[eachKey].baseKey;
          // console.log('in get_initialvalues_object_important_points_explanation, getOverlappedkeysMapped, eachPageObject[eachKey].baseKey, eachKey: ', eachPageObject[eachKey].baseKey, eachKey);
          if (!object[baseKey]) {
            // console.log('in get_initialvalues_object_important_points_explanation, getOverlappedkeysMapped, if object[baseKey], eachKey: ', object[baseKey], eachKey);
            object[baseKey] = [];
            object[baseKey].push(baseKey);
            object[baseKey].push(eachKey);
          } else {
            // console.log('in get_initialvalues_object_important_points_explanation, getOverlappedkeysMapped, else object[baseKey], eachKey: ', object[baseKey], eachKey);
            object[baseKey].push(eachKey);
          }
        }
      });
    });
    // console.log('in get_initialvalues_object_important_points_explanation, getOverlappedkeysMapped, object: ', object);
    return object;
  }

  function assignOverLappedKeys(key, keyValue) {
    _.each(overlappedkeysMapped[key], each => {
      objectReturned[each] = keyValue;
    });
  }

  function assignMultipleOverLappedKeys(overlappedkeysMapped, key, recordValue, eachPageObject) {
    // if (overlappedkeysMapped[key]) {
      // console.log('in create_edit_document, getInitialValuesObject, key, flat[key], overlappedkeysMapped[key]: ', key, flat[key], overlappedkeysMapped[key]);
      _.each(overlappedkeysMapped[key], eachMappedKey => {
        console.log('in create_edit_document, getInitialValuesObject, assignMultipleOverLappedKeys, key, eachMappedKey, recordValue: ', key, eachMappedKey, recordValue);
        objectReturned[eachMappedKey] = recordValue;
        // if (eachPageObject[eachMappedKey].translation_field) {
        //
        // }
      });
      // console.log('in create_edit_document, getInitialValuesObject, objectReturned: ', objectReturned);
    // }
  }

  function getDegradationSummaryBoolean({ eachPageObject, wooden, inspection }) {
    let count = 0;
    _.each(eachPageObject, eachField => {
      // console.log('DocumentChoices, checkOverAllDegradation eachField: ', eachField)
      if (eachField.degradationKey && inspection[eachField.name] == 'Yes') {
        count++;
      }
    });
    return count > 0;
  }

  function getLanguage(languages, languageCode) {
    let objectReturned = {};
    _.each(languages, eachLanguage => {
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage languages, languageCode: ', languages, languageCode);
      if (eachLanguage.language_code == languageCode) {
        objectReturned = eachLanguage;
        return;
      }
    });
    // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage objectReturned: ', objectReturned);
    return objectReturned;
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
  // setLanguageIndependent for data that is language independent,
  // so assign value to fields from records that have data
  function setLanguageIndependent(baseRecord, eachPageObject, eachFieldKey, recordLanguage) {
    if (baseRecord[eachPageObject[eachFieldKey].translation_column]) {
      const dataAvailable = baseRecord[eachPageObject[eachFieldKey].translation_column]
      objectReturned[eachPageObject[eachFieldKey].translation_field] = dataAvailable;
      objectReturned[eachFieldKey] = dataAvailable;
    }

    if (recordLanguage[eachPageObject[eachFieldKey].translation_column]) {
      const dataAvailable = recordLanguage[eachPageObject[eachFieldKey].translation_column]
      objectReturned[eachPageObject[eachFieldKey].translation_field] = dataAvailable;
      objectReturned[eachFieldKey] = dataAvailable;
    }
  }

  function setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned }) {
    if (baseRecord.language_code == Documents[documentKey].baseLanguage) {
      // get building language for use translated field;
      let recordLanguage = {};
      recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = Documents base recordLanguage, documentLanguageCode: ', recordLanguage, documentLanguageCode);
      // assign buildingLangugae value to translated field
      objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      objectReturned[eachFieldKey] = baseRecord[eachPageObject[eachFieldKey].translation_column];
      // if the field is language independent, fill in with the language record that has the data
      if (eachPageObject[eachFieldKey].language_independent) {
        setLanguageIndependent(baseRecord, eachPageObject, eachFieldKey, recordLanguage)
      }
    } else if (baseRecord.language_code == documentLanguageCode) {
      // if building language code is different from base language for document
      // give translated field the baseRecord value
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned: ', baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned);
      objectReturned[eachPageObject[eachFieldKey].translation_field] = baseRecord[eachPageObject[eachFieldKey].translation_column];
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]);
      let recordLanguage = {};
      recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, recordLanguage: ', eachFieldKey, recordLanguage);
      if (!_.isEmpty(recordLanguage)) {
        objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      }
      // if the field is language independent, fill in with the language record that has the data
      if (eachPageObject[eachFieldKey].language_independent) {
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if eachPageObject[eachFieldKey].language_independent : ', eachPageObject[eachFieldKey].language_independent );
        setLanguageIndependent(baseRecord, eachPageObject, eachFieldKey, recordLanguage)
      }
    } else {
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      const recordLanguage1 = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      if (Documents[documentKey].translation) {
        objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
        objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
      } else {
        if (documentLanguageCode === recordLanguage.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
        if (documentLanguageCode === recordLanguage1.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
      }
    }
  }

  function setAddressLanguage({ baseRecord, address, eachAddressKey, eachPageObject, }) {
    objectReturned[eachAddressKey] = address;
    // if address key in overlapped keys has translation field
    if (eachPageObject[eachAddressKey].translation_field) {
      // if flat language code is the document base language
      if (baseRecord.language_code == Documents[documentKey].baseLanguage) {
        const recordLanguage = getLanguage(baseRecord[eachPageObject[eachAddressKey].translation_record], documentLanguageCode);
        // get address1, city, state, zip in one string
        const addressTranslation = createAddress(recordLanguage);
        objectReturned[eachPageObject[eachAddressKey].translation_field] = addressTranslation;
      // else if baseRecord language code is the document translated language
      } else if (baseRecord.language_code == documentLanguageCode) {
        const recordLanguage = getLanguage(baseRecord[eachPageObject[eachAddressKey].translation_record], Documents[documentKey].baseLanguage);
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setAddressLanguage, recordLanguage: ', recordLanguage);
        const addressTranslation = createAddress(recordLanguage);
        objectReturned[eachAddressKey] = addressTranslation;
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setAddressLanguage, eachPageObject[eachAddressKey]: ', eachPageObject[eachAddressKey]);
        objectReturned[eachPageObject[eachAddressKey].translation_field] = address;
      } else {
        const recordLanguage = getLanguage(baseRecord[eachPageObject[eachAddressKey].translation_record], Documents[documentKey].baseLanguage);
        const recordLanguage1 = getLanguage(baseRecord[eachPageObject[eachAddressKey].translation_record], documentLanguageCode);
        const addressTranslation = createAddress(recordLanguage);
        const addressTranslation1 = createAddress(recordLanguage1);
        objectReturned[eachAddressKey] = addressTranslation;
        objectReturned[eachPageObject[eachAddressKey].translation_field] = addressTranslation1;
      }
    } else {
      const recordLanguage = getLanguage(flat[eachPageObject[eachAddressKey].translation_record], Documents[documentKey].baseLanguage);
      const recordLanguage1 = getLanguage(flat[eachPageObject[eachAddressKey].translation_record], documentLanguageCode);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setAddressLanguage, in else if translation_field, recordLanguage, recordLanguage1: ', recordLanguage, recordLanguage1);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setAddressLanguage, in else if translation_field, eachAddressKey: ', eachAddressKey);
      const addressTranslation = createAddress(recordLanguage);
      const addressTranslation1 = createAddress(recordLanguage1);
      if (recordLanguage.language_code === documentLanguageCode) objectReturned[eachAddressKey] = addressTranslation;
      if (recordLanguage1.language_code === documentLanguageCode) objectReturned[eachAddressKey] = addressTranslation1;
    }
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!! Start of instructions to assign values!!!!!!!!!!!!!!!
  // get keys that overlap in documentFields e.g. address and address_1;
  // they have the save value but appear in different parts of the document
    const overlappedkeysMapped = getOverlappedkeysMapped();
    // console.log('in get_initialvalues_object_important_points_explanation, overlappedkeysMapped: ', overlappedkeysMapped);
  // define object to be returned to mapStateToProps in CreateEditDocument
  // const overlappedkeysMapped = { address: ['address_1'], size: ['size_1'], building_name: ['building_name_1'], unit: ['unit_1'], construction: ['construction_1'] };
    const objectReturned = {};
    const allFields = {};
    // iterate throught each page of documentFields eg ImportantPointsExplanation
    // this will enable checking of whether flat or building object contains keys to assign
    _.each(documentFields, eachPageObject => {
      // const language = 'jp'
      const language = Documents[documentKey].baseLanguage
      const ownerProfile = getProfile(userOwner.profiles, language);
      const ownerProfileTranslation = getProfile(userOwner.profiles, documentLanguageCode);
      const tenantProfile = getProfile(booking.user.profiles, language);
      // console.log('in get_initialvalues_object_important_points_explanation, ownerProfile, flat, booking, tenant, userOwner, documentLanguageCode: ', ownerProfile, flat, booking, tenant, userOwner, documentLanguageCode);
      // get all fiels names in one array; used in handleFormSubmit
      _.each(eachPageObject, (eachField, i) => {
        allFields[eachField.name] = i;
      });
      // form string for user tenant names
      if (tenantProfile.first_name && tenantProfile.last_name) {
        const fullName = tenantProfile.last_name ? tenantProfile.last_name.concat(` ${tenantProfile.first_name}`) : '';
        objectReturned.tenant_name = fullName;
        // objectReturned.tenant_phone = tenantProfile.phone;
      }
      // Name of document; Not printed PDF but associated with documnt in agreement.document_name
      objectReturned.document_name = Documents[documentKey][documentLanguageCode];
      // assign today's date
      const today = new Date();
      objectReturned.date_year = today.getFullYear();
      objectReturned.date_month = today.getMonth() + 1;
      objectReturned.date_day = today.getDate();
      // get the contractor that is assigned to be the rental broker
      // const broker = getContractor('rental_broker');
      //
      // objectReturned.broker_company_name = broker.company_name;
      // if (broker.first_name && broker.last_name) {
      //   const brokerRepFullName = broker.last_name.concat(` ${broker.first_name}`);
      //   objectReturned.broker_representative_name = brokerRepFullName;
      // }
      // objectReturned.broker_address_hq = createAddress(broker);
      // objectReturned.broker_registration_number = broker.registration_number;
      // objectReturned.broker_registration_date = formatDate(new Date(broker.registration_date));

      // const brokerStaff = getStaff({ rentalAssignments: assignments.rental_broker, leader: true });
      // if (brokerStaff.first_name && brokerStaff.last_name) {
      //   const brokerStaffFullName = brokerStaff.last_name.concat(` ${brokerStaff.first_name}`);
      //   objectReturned.broker_staff_name = brokerStaffFullName;
      // }
      // objectReturned.broker_staff_address = createAddress(brokerStaff);
      // objectReturned.broker_staff_phone = brokerStaff.phone;
      // objectReturned.broker_staff_registration = brokerStaff.registration;
      // objectReturned.broker_staff_registration = brokerStaff.registration;
      const contract = getContract('rental_broker');
      objectReturned.contract_work_sub_type = contract.work_sub_type;
      // objectReturned.contract_work_sub_type = contract.work_sub_type;
      // just a place holder for notes; need to create column in flat or new model for ownership
      // const notes = 'なし.';
      // const notesTranslation = 'None.';
      // // const notes = 'Only sixty four characters fit in this box. This is sixty four. The end.'
      // // max number of characters 60!!!!!
      // objectReturned.building_ownership_notes = notes;
      // objectReturned.building_ownership_notes_translation = notesTranslation;
      // const otherNotes = 'なし.';
      // const otherNotesTranslation = 'None.';
      // // const notes = 'Only sixty four characters fit in this box. This is sixty four. The end.'
      // // max number of characters 60!!!!!
      // objectReturned.building_ownership_other_notes = otherNotes;
      // objectReturned.building_ownership_other_notes_translation = otherNotesTranslation;
      //
      // // just a place holder for notes; need to create column in flat or new model for ownership
      // const regulation = '規制です.';
      // const regulationTranslation = 'Here are the.';
      // objectReturned.regulation_name = regulation;
      // objectReturned.regulation_name_translation = regulationTranslation;
      // const regulationSummary = '概要です.';
      // const regulationSummaryTranslation = 'Here is the summary.';
      // objectReturned.regulation_summary = regulationSummary;
      // objectReturned.regulation_summary_translation = regulationSummaryTranslation;

      // for each page in props.documentFields
      _.each(Object.keys(flat), key => {
        // for each flat in boooking
        if (eachPageObject[key]) {
          // if flat key is in one of the pages, on DocumentForm
          // add to objectReturned to be returned as initialValues
          objectReturned[key] = flat[key];
          if (eachPageObject[key].translation_column) {
            // if there is an object with transaltion column
            // baseRecord is the record (eg flat or flat.building) that has inspctions or language
            const baseRecord = flat;
            // eachKeyRecord is key of flat or base record
            const eachRecordKey = key;
            // eachFieldKey is the actual key used in eachPageObject
            // key and eachFieldKey can be different (eg owner_contact_name and flat_owner_name)
            const eachFieldKey = eachPageObject[key].translation_column
            // fill translation field with translations
            setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
          }  // end of if translation column
        }
        // handle overlapped keys ie flat size and size_1, size_2, unit, unit_1, unit_2
        if (overlappedkeysMapped[key]) {
          assignMultipleOverLappedKeys(overlappedkeysMapped, key, flat[key], eachPageObject);
        }
      });
      // assumes party to the rental agreement is the user
      if (ownerProfile.first_name && ownerProfile.last_name) {
        const ownerFullName = ownerProfile.last_name ? ownerProfile.last_name.concat(` ${ownerProfile.first_name}`) : '';
        objectReturned.owner_name = ownerFullName;
        objectReturned.owner_address = createAddress(ownerProfile);
      }

      if (ownerProfileTranslation.first_name && ownerProfileTranslation.last_name) {
        const fullName = ownerProfileTranslation.last_name ? ownerProfileTranslation.last_name.concat(` ${ownerProfileTranslation.first_name}`) : '';
        objectReturned.owner_name_translation = fullName;
        objectReturned.owner_address_translation = createAddress(ownerProfileTranslation);
      }
      // if user is the owner, use user profile
      // if (flat.owner_name == 'user') {
      // if (!flat.owner_name) {
      //   const ownerFullName = ownerProfile.last_name.concat(` ${ownerProfile.first_name}`);
      //   objectReturned.flat_owner_name = ownerFullName;
      //   objectReturned.flat_owner_address = createAddress(ownerProfile);
      // } else {
      //   // else use the owner in flat
      //   objectReturned.flat_owner_name = flat.owner_name;
      //   objectReturned.flat_owner_address = flat.owner_address;
      // }
      if (eachPageObject.flat_owner_name) {
        if (flat.owner_name) {
          const flatOwnerFields = ['flat_owner_name', 'flat_owner_company', 'flat_owner_phone', 'flat_owner_address'];
          if (eachPageObject[flatOwnerFields[0]]) {
            const baseRecord = flat;
            _.each(flatOwnerFields, each => {
              if (eachPageObject[each]) {
                if (eachPageObject[each].translation_column) {
                  const eachFieldKey = each;
                  const eachRecordKey = eachPageObject[each].translation_column;
                  setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
                } else {
                  if (each != baseRecord[eachPageObject[each].record_column]) {
                    objectReturned[each] = baseRecord[eachPageObject[each].record_column];
                  } else {
                    objectReturned[each] = baseRecord[eachPageObject[each].record_column];
                  }
                }
              }
            });
          }
        }
      }
      // flat address
      const flatAddress = createAddress(flat);

      if (flatAddress) {
        // objectReturned.address = address;
        objectReturned.address_check = 'address_exists';
        assignMultipleOverLappedKeys(overlappedkeysMapped, 'address_check', 'address_exists', {});
        // if (overlappedkeysMapped.address) {
        //   assignMultipleOverLappedKeys(overlappedkeysMapped, 'address', address);
        // }
      }
      // add address to initialvalues objectReturned
      // if (eachPageObject.address || eachPageObject.address_1) {
      // iterate over address key in overlappedkeysMapped (all address fields in document)
      let baseRecord = flat;
      const attribute = 'address';
      _.each(overlappedkeysMapped[attribute], eachAddressKey => {
        // if pageObject has add in it
        if (eachPageObject[eachAddressKey]) {
          objectReturned[eachAddressKey] = flatAddress;
          const address = flatAddress;
          // if address key in overlapped keys has translation field
          setAddressLanguage({ baseRecord, address, eachAddressKey, eachPageObject });
        }
      });

      if (flat.building) {
        if (flat.building.inspections) {
          // const inspection = getInspection(flat.building.inspections, 'jp');
          let inspection = {};
          let inspectionTranslation = {};
          inspection = getInspection(flat.building.inspections, Documents[documentKey].baseLanguage);
          inspectionTranslation = getInspection(flat.building.inspections, documentLanguageCode);
          // console.log('in create_edit_document, getInitialValuesObject, inspection, flat.building.inspections: ', inspection, flat.building.inspections);
          !_.isEmpty(inspection) ? (objectReturned.building_inspection_summary = inspection.inspection_summary) : (objectReturned.building_inspection_summary = '');
          !_.isEmpty(inspectionTranslation) ? (objectReturned.building_inspection_summary_translation = inspectionTranslation.inspection_summary) : (objectReturned.building_inspection_summary_translation = '');
          const inspectionDateFormatted = formatDateForForm(new Date(inspection.inspection_date))
          !_.isEmpty(inspection) ? (objectReturned.inspection_date = inspectionDateFormatted) : (objectReturned.inspection_date = '');

          if (!_.isEmpty(inspection)) {
            _.each(Object.keys(inspection), key => {
              // for each inspection in boooking
              if (eachPageObject[key]) {
                // if inspection key is in one of the pages, on DocumentForm
                // add to objectReturned to be returned as initialValues
                objectReturned[key] = inspection[key];
                if (eachPageObject[key].translation_column) {
                  // if building language code equal base language for the document
                  // baseRecord = flat.building;
                  // const eachRecordKey = key;
                  // const eachFieldKey = eachPageObject[key].translation_column
                  // // fill translation field with translations
                  // setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
                  objectReturned[key] = inspection[key]
                  objectReturned[eachPageObject[key].translation_field] = inspectionTranslation[key]
                }  // end of if translation column
              }
              // handle overlapped keys ie inspection size and size_1, size_2, unit, unit_1, unit_2
              if (overlappedkeysMapped[key]) {
                assignMultipleOverLappedKeys(overlappedkeysMapped, key, inspection[key], {});
                _.each(overlappedkeysMapped[key], eachOverlappedKey => {
                  if (eachPageObject[eachOverlappedKey]) {
                    objectReturned[eachOverlappedKey] = inspection[key];
                    if (eachPageObject[eachOverlappedKey].translation_field) {
                      objectReturned[eachPageObject[eachOverlappedKey].translation_field] = inspectionTranslation[key];
                    }
                  }
                })
              }
              // iterate through inspection amenity
              // end of each inspection amenity
            });
            if (eachPageObject.degradation_exists_wooden || eachPageObject.degradation_exists_concrete) {
              objectReturned.degradation_exists_wooden = getDegradationSummaryBoolean({ eachPageObject, wooden: true, inspection });
              objectReturned.degradation_exists_concrete = getDegradationSummaryBoolean({ eachPageObject, wooden: false, inspection });
            }
          }
          // need to have inspectionDateFormatted after iteration above so that date format is correct for
          // date input element to be able to read it ie 2018-01-01
          inspection ? assignMultipleOverLappedKeys(overlappedkeysMapped, 'inspection_date', inspectionDateFormatted, {}) : '';
        }
      }

      if (eachPageObject.date_prepared) {
        // if flat key is in one of the pages, on DocumentForm
        // add to objectReturned to be returned as initialValues
        const dateTodayFormatted = formatDateForForm(new Date());
        objectReturned.date_prepared = dateTodayFormatted;
        assignMultipleOverLappedKeys(overlappedkeysMapped, 'date_prepared', dateTodayFormatted, {});
      }
      // for evaluating if has toilet or not!!!
      if (flat.toilet) {
        objectReturned.toilet = true;
        // objectReturned.toilet_other = flat.toilet;
      }

      objectReturned.escrow_for_deposit = false;

      const bookingDatesObject = getBookingDateObject(booking);
      _.each(Object.keys(bookingDatesObject), dateKey => {
        objectReturned[dateKey] = bookingDatesObject[dateKey];
      });

      const contractLengthObject = getContractLength(booking);
      objectReturned.contract_length_years = contractLengthObject.years;
      objectReturned.contract_length_months = contractLengthObject.months;

      objectReturned.contract_type = 'fixed_term_rental_contract';


      // end of Object.keys flat
      // const importantAmenityArray = ['kitchen', 'bath_tub', 'shower', 'water_heater', 'hot_water', 'ac', 'heater', 'kitchen_grill']
      _.each(Object.keys(flat.amenity), eachAmenityKey => {
        if (eachPageObject[eachAmenityKey]) {
          // if attributes in flat.amenity are on DocumentForm, add to initialValues objectReturned
          // if (importantAmenityArray.includes(eachAmenityKey)) {
            // objectReturned[eachAmenityKey] = getAmenityInput(eachAmenityKey);
          // } else {
          objectReturned[eachAmenityKey] = flat.amenity[eachAmenityKey];
          // }
        }
      });
      // end of each Object.keys flat.amenity
      if (flat.building) {
        objectReturned.electricity = 'add column';
        // test if building has been added to flat
        _.each(Object.keys(flat.building), eachBuildingKey => {
          // if (eachBuildingKey == 'name') {
          //   eachBuildingKey = 'flat_building_name';
          // }
          if (eachPageObject[eachBuildingKey]) {
            // if attributes in flat.building are on DocumentForm, add to initialValues objectReturned
            // if (documentFields[eachPageObject][eachBuildingKey].component == 'select') {
            //   const choice = getChoice(Building[eachBuildingKey].choices, flat.building[eachBuildingKey])
            //   console.log('in create_edit_document, getInitialValuesObject, choice: ', choice);
            //   // objectReturned[eachBuildingKey] = choice['jp'];
            // }
            objectReturned[eachBuildingKey] = flat.building[eachBuildingKey];
            // assignOverLappedKeys(eachBuildingKey, flat.building[eachBuildingKey])
            if (eachPageObject[eachBuildingKey].translation_column) {
              // if building language code equal base language for the document
              baseRecord = flat.building;
              const eachRecordKey = eachBuildingKey;
              const eachFieldKey = eachPageObject[eachBuildingKey].translation_column
              // fill translation field with translations
              setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
            } // end of if translation column
          } // end of eachPageObject[eachBuildingKey]
          // if keys are in overlapped keys object
          if (overlappedkeysMapped[eachBuildingKey]) {
            _.each(overlappedkeysMapped[eachBuildingKey], eachOverlappedKey => {
              baseRecord = flat.building;
              const eachRecordKey = eachBuildingKey;
              const eachFieldKey = eachOverlappedKey;
              // const eachFieldKey = eachPageObject[eachBuildingKey].translation_column
              // setLanguage only if overlappedKey in eachPageObject
              if (eachPageObject[eachOverlappedKey]) {
                if (eachPageObject[eachOverlappedKey].translation_column) {
                  // console.log('in create_edit_document, getInitialValuesObject, flat.building overlappedkeysMapped eachPageObject, eachBuildingKey, eachOverlappedKey: ', eachPageObject, eachBuildingKey, eachOverlappedKey);
                  setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
                } else {
                objectReturned[eachOverlappedKey] = flat.building[eachBuildingKey];
                }
              }
            })
            // assignMultipleOverLappedKeys(overlappedkeysMapped, eachBuildingKey, flat.building[eachBuildingKey], eachPageObject);
          } // end of if overlappedkeysMapped[eachBuildingKey]
        }); // end of each flat.building
        // management in impotant points is the building managmenent,
        // not the property manager in fixed term contract
        if (eachPageObject.building_management_address) {
          baseRecord = flat.building;
          const eachFieldKey = 'building_management_address';
          const eachRecordKey = 'building_management_address';
          // objectReturned.building_management_address = baseRecord.building_management_address;
          setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
          // const flatBuildingAddress = createAddress(flat.building);
          // const eachAddressKey = 'building_management_address';
          // const address = flatBuildingAddress;
          // setAddressLanguage({ baseRecord, address, eachAddressKey, eachPageObject });
        }

        // end of each Object.keys flat.building
      }

      if (eachPageObject.management_name || eachPageObject.management_company) {
        // get managment company profile from contractorTranslations state object
        const contractorType = 'rental_broker';
        const managementProfile = getManagement(contractorTranslations, language, contractorType);
        const managementProfileTranslation = getManagement(contractorTranslations, documentLanguageCode, contractorType);
        objectReturned.management_company = managementProfile.company_name;
        objectReturned.management_company_translation = managementProfileTranslation.company_name;
        objectReturned.management_phone = managementProfile.phone;
        const fullName = managementProfile.last_name ? managementProfile.last_name.concat(` ${managementProfile.first_name}`) : '';
        objectReturned.management_name = fullName;
        const fullNameTranslation = managementProfileTranslation.last_name ? managementProfileTranslation.last_name.concat(` ${managementProfileTranslation.first_name}`) : '';
        objectReturned.management_name_translation = fullNameTranslation;
        if (managementProfile.language_code = Documents[documentKey].baseLanguage) {
          objectReturned.management_registration_number_front = managementProfileTranslation.registration_number_front;
          objectReturned.management_registration_number = managementProfileTranslation.registration_number;
        } else {
          objectReturned.management_registration_number_front = managementProfile.registration_number_front;
          objectReturned.management_registration_number = managementProfile.registration_number;
        }

        if (managementProfile.address1 && managementProfile.city) {
          // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, in managementProfile, managementProfileTranslation: ', managementProfile, managementProfileTranslation);
          if (managementProfile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            // fullAddress = fullAddress.concat(`${managementProfile.address1} ${managementProfile.city} ${managementProfile.state} ${managementProfile.zip} ${managementProfile.country}`);
            fullAddress = fullAddress ? fullAddress.concat(`${managementProfile.zip}${managementProfile.state}${managementProfile.city}${managementProfile.address1}`) : '';
            objectReturned.management_address = fullAddress;
          }
        }

        if (managementProfileTranslation.address1 && managementProfileTranslation.city) {
          console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, managementProfile, in managementProfileTranslation: ', managementProfile, managementProfileTranslation);
          if (managementProfileTranslation.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            fullAddress = fullAddress ? fullAddress.concat(`${managementProfileTranslation.address1} ${managementProfileTranslation.city} ${managementProfileTranslation.state} ${managementProfileTranslation.zip} ${managementProfileTranslation.country}`) : '';
            objectReturned.management_address_translation = fullAddress;
          }
        }
      } // end of if management_name

      if (eachPageObject.broker_company_name) {
        const contractorType = 'rental_broker';
        const brokerProfile = getManagement(contractorTranslations, language, contractorType);
        const brokerProfileTranslation = getManagement(contractorTranslations, documentLanguageCode, contractorType);
          // console.log('in create_edit_document, getInitialValuesObject, brokerProfile, brokerProfileTranslation: ', brokerProfile, brokerProfileTranslation);

        objectReturned.broker_registration_jurisdiction = brokerProfile.registration_jurisdiction;
        objectReturned.broker_registration_jurisdiction_translation = brokerProfileTranslation.registration_jurisdiction;
        objectReturned.broker_registration_grantor = brokerProfile.registration_grantor;
        objectReturned.broker_registration_front_number = brokerProfile.registration_front_number;
        objectReturned.broker_registration_number = brokerProfile.registration_number;
        if (brokerProfile.address1 && brokerProfile.city) {
          if (brokerProfile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            // fullAddress = fullAddress.concat(`${brokerProfile.address1} ${brokerProfile.city} ${brokerProfile.state} ${brokerProfile.zip} ${brokerProfile.country}`);
            fullAddress = fullAddress ? fullAddress.concat(`${brokerProfile.zip}${brokerProfile.state}${brokerProfile.city}${brokerProfile.address1}`) : '';
            objectReturned.broker_address_hq = fullAddress;
          }
        }

        if (brokerProfileTranslation.address1 && brokerProfileTranslation.city) {
          if (brokerProfileTranslation.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            fullAddress = fullAddress ? fullAddress.concat(`${brokerProfileTranslation.address1} ${brokerProfileTranslation.city} ${brokerProfileTranslation.state} ${brokerProfileTranslation.zip} ${brokerProfileTranslation.country}`) : '';
            objectReturned.broker_address_hq_translation = fullAddress;
          }
        }
        // console.log('in create_edit_document, getInitialValuesObject, brokerProfile.company_name, brokerProfileTranslation.company_name: ', brokerProfile.company_name, brokerProfileTranslation.company_name);
        objectReturned.broker_company_name = brokerProfile.company_name;
        objectReturned.broker_company_name_translation = brokerProfileTranslation.company_name;
        const fullName = brokerProfile.last_name ? brokerProfile.last_name.concat(` ${brokerProfile.first_name}`) : '';
        objectReturned.broker_representative_name = fullName;
        const fullNameTranslation = brokerProfileTranslation.first_name.concat(` ${brokerProfileTranslation.last_name}`);
        objectReturned.broker_representative_name_translation = fullNameTranslation;
        objectReturned.broker_registration_date = formatDate(new Date(brokerProfile.registration_date));

        const brokerStaffProfile = getManagement(staffTranslations, language);
        const brokerStaffProfileTranslation = getManagement(staffTranslations, documentLanguageCode);
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, brokerStaffProfile, brokerStaffProfileTranslation: ', brokerStaffProfile, brokerStaffProfileTranslation);
        objectReturned.broker_staff_registration_jurisdiction = brokerStaffProfile.registration_jurisdiction;
        objectReturned.broker_staff_registration_jurisdiction_translation = brokerStaffProfileTranslation.registration_jurisdiction;
        objectReturned.broker_staff_registration = brokerStaffProfile.registration;
        const fullNameStaff = brokerStaffProfile.last_name ? brokerStaffProfile.last_name.concat(` ${brokerStaffProfile.first_name}`) : '';
        objectReturned.broker_staff_name = fullNameStaff;
        const fullNameStaffTranslation = brokerStaffProfileTranslation.first_name ? brokerStaffProfileTranslation.first_name.concat(` ${brokerStaffProfileTranslation.last_name}`) : '';
        objectReturned.broker_staff_name_translation = fullNameStaffTranslation;
        if (brokerStaffProfile.address1 && brokerStaffProfile.city) {
          if (brokerStaffProfile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            // fullAddress = fullAddress.concat(`${brokerStaffProfile.address1} ${brokerStaffProfile.city} ${brokerStaffProfile.state} ${brokerStaffProfile.zip} ${brokerStaffProfile.country}`);
            fullAddress = fullAddress ? fullAddress.concat(`${brokerStaffProfile.zip}${brokerStaffProfile.state}${brokerStaffProfile.city}${brokerStaffProfile.address1}`) : '';
            objectReturned.broker_staff_address = fullAddress;
          }
        }

        if (brokerStaffProfileTranslation.address1 && brokerStaffProfileTranslation.city) {
          if (brokerStaffProfileTranslation.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            fullAddress = fullAddress.concat(`${brokerStaffProfileTranslation.address1} ${brokerStaffProfileTranslation.city} ${brokerStaffProfileTranslation.state} ${brokerStaffProfileTranslation.zip} ${brokerStaffProfileTranslation.country}`);
            objectReturned.broker_staff_address_translation = fullAddress;
          }
        }
        objectReturned.broker_staff_phone = brokerStaffProfile.phone;
      }

      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, booking: ', booking);
      // Assign initialValues to main agreement insertField fields
      if (!_.isEmpty(mainInsertFieldsObject)) {
        // const documentForm = Documents[this.props.documentKey].form;
        // _.each(Object.keys(documentForm), eachPage => {
          _.each(Object.keys(mainInsertFieldsObject), eachFieldKey => {
            if (eachPageObject[eachFieldKey]) {
              _.each(mainInsertFieldsObject[eachFieldKey], eachArrayItem => {
                // console.log('in create_edit_document, getSavedDocumentInitialValuesObject, before if language_code == baseLanguage documentForm[eachPage][eachFieldKey], eachFieldKey, eachInsertField: ', documentForm[eachPage][eachFieldKey], eachFieldKey, eachArrayItem);
                if (eachArrayItem.language_code == Documents[documentKey].baseLanguage) {
                  // console.log('in create_edit_document, getSavedDocumentInitialValuesObject, if language_code == baseLanguage documentForm[eachPage][eachFieldKey], eachFieldKey, eachInsertField: ', documentForm[eachPage][eachFieldKey], eachFieldKey, eachArrayItem);
                  objectReturned[eachFieldKey] = eachArrayItem.value;
                } else if (eachArrayItem.language_code == documentLanguageCode) {
                  // console.log('in create_edit_document, getSavedDocumentInitialValuesObject, else if language_code == baseLanguage documentForm[eachPage][eachFieldKey], eachFieldKey, eachInsertField: ', documentForm[eachPage][eachFieldKey], eachFieldKey, eachArrayItem);
                  objectReturned[eachPageObject[eachFieldKey].translation_field] = eachArrayItem.value;
                }
              });
            }
          });
        // });
      }

      // if (flat.bank_account) {
      //   // test if bank_account has been added to flat
      //   _.each(Object.keys(flat.bank_account), eachBankAccountKey => {
      //     // if (eachBuildingKey == 'name') {
      //     //   eachBuildingKey = 'flat_bank_account_name';
      //     // }
      //     if (eachPageObject[eachBankAccountKey]) {
      //       // if attributes in flat.bank_account are on DocumentForm, add to initialValues objectReturned
      //       // if key is account_number, add *** to initial value
      //       if (eachBankAccountKey == 'account_number') {
      //         objectReturned[eachBankAccountKey] = flat.bank_account[eachBankAccountKey] + '***'
      //       } else {
      //         objectReturned[eachBankAccountKey] = flat.bank_account[eachBankAccountKey];
      //       }
      //     }
      //   });
      // }
      // // CALCULATED fields on document
      // // set payment due date for fees same as rent payment due date
      // if (flat.payment_due_date) {
      //   objectReturned.fees_payment_due_date = flat.payment_due_date;
      // }
      //
      // if (flat.deposit) {
      //   objectReturned.deposit_amount = (flat.price_per_month * flat.deposit);
      // }
      //
      // if (flat.price_per_month) {
      //   // convert float to integer by multiplying flat by integer
      //   objectReturned.price_per_month = (flat.price_per_month * 1);
      // }
      //
      // // handle rent_payment_method;
      // if (flat.rent_payment_method) {
      //   // if bank transfer, nothing filled on the place to deliver rent line
      //   if (flat.rent_payment_method == 'bank_transfer') {
      //     objectReturned.rent_payment_method = '';
      //   } else {
      //     // if not bank transfer, get the choice from the constants objectReturned
      //     let choice = {}
      //     // get the choice with the value ==
      //     _.each(RentPayment.rent_payment_method.choices, eachChoice => {
      //       if (eachChoice.value == flat.rent_payment_method) {
      //         // if match record in flat, assign to choice
      //         choice = eachChoice;
      //       }
      //     })
      //     // if choice is empty, user has entered own method
      //     if (!_.isEmpty(choice)) {
      //       // if standard input other than bank transfer, assign method to objectReturned
      //       // get language jp or en
      //       objectReturned.rent_payment_method = choice[appLanguageCode]
      //     } else {
      //       // if empty, it is own entry so assign to objct
      //       objectReturned.rent_payment_method = flat.rent_payment_method;
      //     }
      //     // if not bank transfer, do not put rectangle on transfer fee paid by
      //     objectReturned.transfer_fee_paid_by = '';
      //   }
      //   // end of else
      // }
      // // end of if flat.rent_payment_method
      // // calculate number of facilties, car park, bicycle parking, etc
      // // and get a string of their numbers 1A, 2D etc.
      // if (booking.facilities) {
      //   // console.log('in create_edit_document, getInitialValuesObject, flat.facilities: ', flat.facilities);
      //   // set up arrays for each facility
      //   const carParkingArray = [];
      //   const bicycleParkingArray = [];
      //   const motorcycleParkingArray = [];
      //   const storageArray = [];
      //   // set up array of each array;
      //   const facilityArray = [carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray];
      //   // const yardArray = []
      //   // specify which facility_types should be iterated over
      //   const facilityTypes = ['car_parking', 'bicycle_parking', 'motorcycle_parking', 'storage'];
      //   // iterate through each facility.js facility_type choices
      //   _.each(Facility.facility_type.choices, eachChoice => {
      //     // iterate over each facility assigned to flat
      //     _.each(booking.facilities, eachFacility => {
      //       if (eachFacility.facility_type == eachChoice.value && facilityTypes.includes(eachFacility.facility_type)) {
      //         // if there is a facility that match the choices and the types that we care about
      //         // push them in respective arrays
      //         eachFacility.facility_type == 'car_parking' ? carParkingArray.push(eachFacility) : '';
      //         eachFacility.facility_type == 'bicycle_parking' ? bicycleParkingArray.push(eachFacility) : '';
      //         eachFacility.facility_type == 'motorcycle_parking' ? motorcycleParkingArray.push(eachFacility) : '';
      //         eachFacility.facility_type == 'storage' ? storageArray.push(eachFacility) : '';
      //         // eachFacility.facility_type == 'dedicated_yard' ? yardArray.push(eachFacility) : '';
      //       }
      //     })
      //   })
      //   // console.log('in create_edit_document, getInitialValuesObject, facilityArray: ', facilityArray);
      //   // console.log('in create_edit_document, getInitialValuesObject, carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray: ', carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray);
      //   // facilityUsageFeeCount to calculate total of all facilities to charge
      //   let facilityUsageFeeCount = 0;
      //   // iterate over each array in array of of arrays
      //   _.each(facilityArray, eachArray => {
      //     // console.log('in create_edit_document, getInitialValuesObject, eachArray: ', eachArray);
      //     // if an array has something in it, count how many and form their strings
      //     if (eachArray.length > 0) {
      //       // count for how many spaces (parking, bicycle, motorcyle)
      //       let count = 0;
      //       // facilitySpaces for string showing space numbers 1A, 2B etc
      //       let facilitySpaces = ''
      //       _.each(eachArray, each => {
      //         // console.log('in create_edit_document, getInitialValuesObject, each: ', each);
      //         // console.log('in create_edit_document, getInitialValuesObject, each: ', each);
      //         // forms string with facility numbers eg 1A, 2B etc
      //         if (count > 0) {
      //           facilitySpaces = facilitySpaces.concat(', ')
      //           facilitySpaces = facilitySpaces.concat(each.facility_number)
      //           // console.log('in create_edit_document, getInitialValuesObject, facilitySpaces, count if > 0: ', facilitySpaces, count);
      //           count++;
      //         } else {
      //           facilitySpaces = facilitySpaces.concat(each.facility_number)
      //           // console.log('in create_edit_document, getInitialValuesObject, facilitySpaces, count else: ', facilitySpaces, count);
      //           count++;
      //         }
      //         // get the choice that corresponds to each facility in facility types
      //         const choiceInEach = getChoice(each);
      //         // console.log('in create_edit_document, getInitialValuesObject, choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]: ', choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]);
      //         // if facility NOT included, add up price_per_month
      //         if (!flat[choiceInEach.facilityObjectMap]) {
      //           facilityUsageFeeCount += each.price_per_month;
      //         }
      //       })
      //       // get the choice that corresponds to the facility_type
      //       const choice = getChoice(eachArray[0]);
      //       console.log('in create_edit_document, getInitialValuesObject, choice: ', choice);
      //       //set each parking_spaces and parking_space_number for car, bicycle, motorcycle and storage
      //       // for some reason, parking_spaces gets assigned '0' in form initial, so assign empty string to start,
      //       // then when choice is selected, assign a number.
      //       objectReturned.parking_spaces = '';
      //       objectReturned[choice.documentFormMap1] = count;
      //       // objectReturned[choice.documentFormMap1] = ((count > 0) ? count : '');
      //       objectReturned[choice.documentFormMap2] = facilitySpaces;
      //       objectReturned.facilities_usage_fee = facilityUsageFeeCount;
      //     }
      //   });
      // }
      // // form string for user owner names
      // if (userOwner.profile.first_name && userOwner.profile.last_name) {
      //   const fullName = userOwner.profile.last_name.concat(` ${userOwner.profile.first_name}`);
      //   objectReturned.owner_name = fullName;
      //   objectReturned.owner_phone = userOwner.profile.phone;
      // }
      //
      // if (booking.tenants) {
      //   let count = 0;
      //   _.each(booking.tenants, (eachTenant) => {
      //     _.each(Object.keys(Tenants), (eachTenantKey, i) => {
      //       // const keys = Object.keys(eachTenant);
      //       const keys = ['name', 'age'];
      //       _.each(keys, key => {
      //         if ((count == Tenants[eachTenantKey].group) && (key == Tenants[eachTenantKey].tenantObjectMap)) {
      //           console.log('in create_edit_document, getInitialValuesObject, eachTenant, key, eachTenantKey: ', eachTenant, key, eachTenantKey);
      //           objectReturned[eachTenantKey] = eachTenant[key];
      //         }
      //       })
      //     })
      //     count++;
      //   });
      //   objectReturned.co_tenants = booking.tenants.length;
      // }

      // form string for address of user owner
      // if (userOwner.profile.address1 && userOwner.profile.city) {
      //   if (userOwner.profile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
      //     let fullAddress = ''
      //     fullAddress = fullAddress.concat(`${userOwner.profile.zip}${userOwner.profile.state}${userOwner.profile.state}${userOwner.profile.city}${userOwner.profile.address1}`);
      //     objectReturned.owner_address = fullAddress;
      //   }
      // }
      //
      // // form get age of tenant
      // if (tenant.profile.birthday) {
      //   const age = calculateAge(tenant.profile.birthday);
      //   objectReturned.tenant_age = age;
      // }
      //
      // if (flat.building.building_owner_name) {
      //   objectReturned.building_owner_name = flat.building.building_owner_name;
      //   objectReturned.building_owner_address = flat.building.building_owner_address;
      //   objectReturned.building_owner_phone = flat.building.building_owner_phone;
      // }
      //
      // console.log('in create_edit_document, getInitialValuesObject, tenant.profile: ', tenant.profile);
      // if (tenant.profile.emergency_contact_name) {
      //   objectReturned.emergency_contact_name = tenant.profile.emergency_contact_name;
      //   objectReturned.emergency_contact_phone = tenant.profile.emergency_contact_phone;
      //   objectReturned.emergency_contact_address = tenant.profile.emergency_contact_address;
      //   objectReturned.emergency_contact_relationship = tenant.profile.emergency_contact_relationship;
      // }
      //
      //
      //   // end of each Object.keys flat.bank_account
      // // end of if flat.building
      // // !!!!!after going through each by each flat, amenity and building,
      // // go through page objectReturned to see if document objectReturned (page) has 'attributes'
      // // set by multipe amenity keys
      // // _.each(Object.keys(eachPageObject), documentPageKey => {
      // //   // iterate through each page objectReturned key
      // //   if ('attributes' in eachPageObject[documentPageKey]) {
      // //     // if attributes key is in one of the objectReturneds in one of the pages
      // //     // take each name in names array and get the value of that key in amenity
      // //     // count up a counter if one of the amenities is true
      // //     let attributeBoolCount = 0;
      // //     _.each(eachPageObject[documentPageKey].attributes.names, eachName => {
      // //       console.log('in create_edit_document, getInitialValuesObject, each attributes eachName, flat.amenity[eachName]: ', eachName, flat.amenity[eachName]);
      // //       if (flat.amenity[eachName]) {
      // //         attributeBoolCount++;
      // //       }
      // //     });
      // //     if (attributeBoolCount > 0) {
      // //       objectReturned[documentPageKey] = true;
      // //     } else {
      // //       objectReturned[documentPageKey] = false;
      // //     }
      // //   }
      // // });
      // // deal with booking dates dates (separates year, month and day of to and from attributes)
      // const bookingDatesObject = getBookingDateObject(booking);
      // _.each(Object.keys(bookingDatesObject), dateKey => {
      //   objectReturned[dateKey] = bookingDatesObject[dateKey];
      // });
      // // end of each bookingDatesObject
      // // get address1, city, state, zip in one string
      // const address = createAddress(flat);
      // // console.log('in create_edit_document, getInitialValuesObject, address: ', address);
      // // add address to initialvalues objectReturned
      // objectReturned.address = address;
      //
      // // get contract length objectReturned with years and months
      // const contractLengthObject = getContractLength(booking);
      // objectReturned.contract_length_years = contractLengthObject.years;
      // objectReturned.contract_length_months = contractLengthObject.months;
      //
      // if (contractLengthObject.years >= 1) {
      //   const contractEndNoticePeriodObject = getContractEndNoticePeriodObject(booking);
      //   objectReturned.notice_from_year = contractEndNoticePeriodObject.from.year;
      //   objectReturned.notice_from_month = contractEndNoticePeriodObject.from.month;
      //   objectReturned.notice_from_day = contractEndNoticePeriodObject.from.day;
      //   objectReturned.notice_to_year = contractEndNoticePeriodObject.to.year;
      //   objectReturned.notice_to_month = contractEndNoticePeriodObject.to.month;
      //   objectReturned.notice_to_day = contractEndNoticePeriodObject.to.day;
      // }
    });
    // !!!!!!!!!!!!!!end of documentForm eachPageObject

    console.log('in create_edit_document, getInitialValuesObject, objectReturned: ', objectReturned);
    // !!!!!!!!!!return objectReturned for assignment to initialValues in mapStateToProps
    return { initialValuesObject: objectReturned, overlappedkeysMapped, allFields };
};
