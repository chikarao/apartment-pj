import React from 'react';
import _ from 'lodash';
import RentPayment from '../constants/rent_payment';
import Facility from '../constants/facility';
import Tenants from '../constants/tenants';
import Documents from '../constants/documents';
// import getBookingDateObject from './get_booking_date_object';
// import getContractLength from './get_contract_length';

import getListValues from '../forms/get_list_values';

// fixed_term_rental_contract.js
export default (props) => {
  const { flat, booking, userOwner, tenant, appLanguageCode, documentFields, agreement, documentKey, documentLanguageCode, contractorTranslations, staffTranslations, template, allObject, templateMappingObjects, documentConstants, bookingDatesObject } = props;

  function getProfile(personProfiles, language) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, userOwner: ', userOwner);
    let returnedProfile = null;
    _.each(personProfiles, eachProfile => {
      if (eachProfile.language_code === language) {
        returnedProfile = eachProfile;
        return;
      }
    });
    return returnedProfile || personProfiles[0];
  }

  function getManagement(contractorArray, language) {
    let returnedProfile = null;
    // _.each(contractorArray, eachContractor => {
      // _.each(contractorArray, each => {
      //   if (each.language_code === language) {
      //     console.log('in get_initialvalues_object-fixed-term-contract, getManagement, contractorArray, language: ', contractorArray, language);
      //   // if ((each.language_code === language) && (each.contractor_type === contractorType)) {
      //     returnedProfile = each;
      //     return;
      //   }
      // });
      contractorArray.some((each) => {
        // console.log('in get_initialvalues_object-fixed-term-contract, getManagement, contractorArray, language: ', contractorArray, language);
        if (each.language_code === language) {
          // if ((each.language_code === language) && (each.contractor_type === contractorType)) {
            returnedProfile = each;
            return returnedProfile;
          }
        return returnedProfile;
      });
    // });
    return returnedProfile || contractorArray[0];
  }


  // function getContractEndNoticePeriodObject(booking) {
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
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, booking: ', booking);
  //   const dateEndOneYear = new Date(booking.date_end);
  //   const dateEndSixMonths = new Date(booking.date_end);
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
  //   const oneYearBefore = new Date(dateEndOneYear.setFullYear(dateEndOneYear.getFullYear() - 1));
  //   const sixMonthsBefore = new Date(dateEndSixMonths.setMonth(dateEndSixMonths.getMonth() - 6));
  //   const oneYearBeforeDay = oneYearBefore.getDate() == (0 || 1) ? 30 : oneYearBefore.getDate() - 1;
  //   const sixMonthsBeforeDay = sixMonthsBefore.getDate() == (0 || 1) ? 30 : sixMonthsBefore.getDate() - 1;
  //   const oneYearBeforeMonth = oneYearBefore.getDate() == (0 || 1) ? oneYearBefore.getMonth() : oneYearBefore.getMonth() + 1;
  //   const sixMonthsBeforeMonth = sixMonthsBefore.getDate() == (0 || 1) ? sixMonthsBefore.getMonth() : sixMonthsBefore.getMonth() + 1;
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore.getFullYear(), sixMonthsBefore.getMonth(), sixMonthsBefore.getDate());
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore);
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
  //
  //   const noticeObject = { from: { year: oneYearBefore.getFullYear(), month: oneYearBeforeMonth, day: oneYearBeforeDay }, to: { year: sixMonthsBefore.getFullYear(), month: sixMonthsBeforeMonth, day: sixMonthsBeforeDay }}
  //   return noticeObject;
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, noticeObject: ', noticeObject);
  // }
  //
  function createAddress(record) {
    let addressFieldArray = [];
    let withComma = false;
    console.log('in get_initialvalues_object-fixed-term-contract, createAddress, record: ', record);
    // if (record.country.toLowerCase() == ('usa' || 'united states of america' || 'us' || 'united states')) {
    // change order of address depending on country
    if (record.country && record.country.toLowerCase() == ('japan' || '日本' || '日本国' || 'japon')) {
      addressFieldArray = ['zip', 'state', 'city', 'address2', 'address1'];
    } else {
      addressFieldArray = ['address1', 'address2', 'city', 'state', 'zip'];
      withComma = true;
    }
    // const address = '';
    const addressArray = [];
    _.each(addressFieldArray, each => {
      // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, address: ', address);
      // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, each, type of record[each]: ', each, typeof record[each]);
      if ((typeof record[each]) == 'string') {
        // const addressString = address.concat(toString(record[each]));
        addressArray.push(record[each])
      }
    });
    const address = withComma ? addressArray.join(', ') : addressArray.join(' ')
    // console.log('in get_initialvalues_object-fixed-term-contract, createAddress, address: ', address);
    return address;
  }

  function getChoice(facility) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getChoice, facility: ', facility);
    const array = [];
    _.each(documentConstants.facility.facility_type.choices, eachChoice => {
      if (eachChoice.value === facility.facility_type) {
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
    languages.some((eachLanguage) => {
        console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage languages, languageCode: ', languages, languageCode);
        if (eachLanguage.language_code === languageCode) {
          objectReturned = eachLanguage;
          return objectReturned;
        }
      }
    );
    // _.each(languages, eachLanguage => {
    //   console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage languages, languageCode: ', languages, languageCode);
    //   if (eachLanguage.language_code === languageCode) {
    //     objectReturned = eachLanguage;
    //     return;
    //   }
    // });
    console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage objectReturned: ', objectReturned);
    return objectReturned;
  }

  // function setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned }) {
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned: ', baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned);
  //   if (baseRecord.language_code === Documents[documentKey].baseLanguage) {
  //     // get building language for use translated field;
  //     const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
  //     // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = Documents base recordLanguage, documentLanguageCode: ', recordLanguage, documentLanguageCode);
  //     // assign buildingLanguage value to translated field
  //     objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
  //     objectReturned[eachFieldKey] = baseRecord[eachPageObject[eachFieldKey].translation_column];
  //   } else if (baseRecord.language_code === documentLanguageCode) {
  //     // if building language code is different from base language for document
  //     // give translated field the baseRecord value
  //     objectReturned[eachPageObject[eachFieldKey].translation_field] = baseRecord[eachPageObject[eachFieldKey].translation_column];
  //     const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
  //     // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode recordLanguage, Documents[documentKey].baseLanguage: ', recordLanguage, Documents[documentKey].baseLanguage);
  //     if (!_.isEmpty(recordLanguage)) {
  //       // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]);
  //       objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
  //     }
  //   } else {
  //     // baseRecord languge is neither the document's baselanguage nor the
  //     // documentLanguageCode selected by the user, so need to look in translations
  //     // e.g. flat and flat_languages
  //     const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
  //     const recordLanguage1 = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
  //     // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage else recordLanguage, recordLanguage1: ', recordLanguage, recordLanguage1);
  //     // if document is a translated/biligual document assign both
  //     if (Documents[documentKey].translation) {
  //       objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
  //       objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
  //     } else {
  //       // if not a translated document, assign one that corresponds to the selected document language code
  //       if (documentLanguageCode === recordLanguage.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
  //       if (documentLanguageCode === recordLanguage1.language_code) objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
  //       // if (documentLanguageCode === recordLanguage.language_code) objectReturned[eachFieldKey] = recordLanguage[eachFieldKey];
  //       // if (documentLanguageCode === recordLanguage1.language_code) objectReturned[eachFieldKey] = recordLanguage1[eachFieldKey];
  //     }
  //   }
  // }

  function getLatestSameDate(inspectionsArray) {
    const sortedInspections = inspectionsArray.sort((a, b) => {
        return a.inspection_date - b.inspection_date;
      });

    function sameDay(day1, day2) {
      const d1 = new Date(day1);
      const d2 = new Date(day2);
      // console.log('in get_initialvalues_object-fixed-term-contract, getLatestSameDate, sortedInspections, day1, day2: ', sortedInspections, day1, day2);
      return d1.getFullYear() === d2.getFullYear()
              && d1.getMonth() === d2.getMonth()
              && d1.getDate() === d2.getDate();
      }

    const object = [];
    _.each(sortedInspections, eachInspection => {
      if (sameDay(sortedInspections[0].inspection_date, eachInspection.inspection_date)) object[eachInspection.language_code] = eachInspection;
    });
    // console.log('in get_initialvalues_object-fixed-term-contract, getLatestSameDate, sortedInspections, object: ', sortedInspections, object);

    return object;
  }


  function getRecordForLanguage(baseRecord, baseRecordName, language) {
    // console.log('in get_initialvalues_object-fixed-term-contract, getRecordForLanguage, baseRecord, baseRecordName, language: ', baseRecord, baseRecordName, language);
    // get language
    let recordWithLanguage = null;
    if (baseRecord.language_code === language) return baseRecord;
    // If the required record with language code is not base, get the one from languages array
    // (eg building_languages array or flat_languages array )
    recordWithLanguage = getLanguage(baseRecord[`${baseRecordName}_languages`], language);
    // If no language is found, just return the base record
    // which will alway be there if this function is run
    return _.isEmpty(recordWithLanguage) || !recordWithLanguage ? baseRecord : recordWithLanguage;
  }
  // getSingleObjectValue receives one object and returns the value to the key received
  const getSingleObjectValue = (p) => {
    if (p.hideKey === p.key) return p.record[p.key] + '***';
    return p.record[p.key];
  };
  // recordWithLanguagesArrayMethod for records such as building and flat
  // (ie has array attached flat_languages, building_languages)
  const recordWithLanguagesArrayMethod = (p) => {
    // If the field neither a translation_object (with _translation on the key) nor
    // has a translation_field (eg building_languages), just get the value, else get language and values
    // if (!p.object.translation_field && !p.object.translation_object) return flat.building[p.key];
    if (!p.object.translation_field && !p.object.translation_object && !p.object.actual_record_key) return p.baseRecord[p.key];
    // Assign baseLanguageCode as the initial language since if no language available,
    // getRecordForLanguage will return the baseRecord (e.g. flat)
    let language = baseLanguageCode;
    let key = null;
        // If the object has translation_field (i.e. is not a tranlation field itself)
    // Assign baseLanguageCode to language to be sent to getRecordForLanguage
    // assign key to key for the record to be returned
    if (p.object.translation_field) {
      language = baseLanguageCode;
      key = p.key;
    }
    // If the object is a tranlation field, get the key without _translation
    if (p.object.translation_object) {
      language = translationLanguageCode;
      key = p.key.split('_');
      // key.splice(key.length - 1, 1).join('_');
      key.splice(-1, 1);
      key = key.join('_');
    }
    // For fields and object names different from record models (e.g. flat)
    if (p.object.actual_record_key) {
      key = p.object.actual_record_key;
    }
    // Get record, either the base flat.building record or one of the building_language record
    // If p.object is language_independent: true then return base record since others will not have the k:v
    const recordWithLanguage = p.object.language_independent
                                ?
                                p.baseRecord
                                :
                                getRecordForLanguage(p.baseRecord, p.baseRecordName, language);

    // console.log('in get_initialvalues_object-fixed-term-contract, recordWithLanguagesArrayMethod, p.key, key, p.object, p.baseRecord, recordWithLanguage, createAddress(recordWithLanguage): ', p.key, key, p.object, p.baseRecord, recordWithLanguage, createAddress(recordWithLanguage));
    // If the key is address key (including address_translation), create address and return
    if (p.address || p.key === 'address' || key[0] === 'address') return createAddress(recordWithLanguage);
    // if (p.key === 'construction_translation') return recordWithLanguage.construction;
    // return value of recordWithLanguage
    return recordWithLanguage[key];
  };

  const bookingMethod = (p) => {
    if (p.key === 'deposit_amount') return parseInt((p.record.final_rent * p.record.final_deposit), 10);
    if (p.key === 'final_deposit') return p.record.final_deposit * 1;
    if (p.key === 'final_rent') return parseInt((p.record.final_rent * 1), 10);
    // console.log('in get_initialvalues_object-fixed-term-contract, bookingMethod, p, bookingDatesObject, bookingDatesObject.noticeObject: ', p, bookingDatesObject, bookingDatesObject.noticeObject);
    // Catch all for getting values from booking or from bookingDatesObject (to_year, from_day etc)
    if (bookingDatesObject[p.key]) return bookingDatesObject[p.key];
    if (bookingDatesObject.noticeObject[p.key]) {
      // console.log('in get_initialvalues_object-fixed-term-contract, bookingMethod, p.key, p, bookingDatesObject, bookingDatesObject.noticeObject[p.key]: ', p.key, p, bookingDatesObject, bookingDatesObject.noticeObject[p.key]);
      return bookingDatesObject.noticeObject[p.key];
    }

    return p.record[p.key];
  };

  const facilityMethod = (p) => {
    const createFacilityObject = () => {
      const object = {};
      // const object = { [p.object.base_key]: [] };
      _.each(Object.keys(documentConstants.facility.facility_type.choices), each => {
        object[each] = [];
      });
      return object;
    };
    // Get an object with each baseKey; If there is a baseKey, get just the key needed;
    // e.g. if parking_space (car) is baseKey, you need only data for the car_parking facility;
    // If getting the total, need object with all keys.
    const facilityObject = p.object.base_key ? { [p.object.base_key]: [] } : createFacilityObject();
    _.each(p.record.facility_bookings, eachFacilityBooking => {
      // Push into array just the type of facility needed;
      // If counting the total, push all types in each array
      if (p.object.base_key) {
        if (p.object.base_key === eachFacilityBooking.facility.facility_type) {
          facilityObject[eachFacilityBooking.facility.facility_type].push(eachFacilityBooking.facility);
        }
      } else {
        facilityObject[eachFacilityBooking.facility.facility_type].push(eachFacilityBooking.facility);
      }
    });

    let facilityUsageFeeSum = 0;
    let facilityIdNumbers = '';
    let facilitySpaces = 0;

    let eachChoice = null;
    _.each(Object.keys(facilityObject), eachFacilityType => {
      // Get the choice for type key e.g. car_parking from facility_type object
      // in facility of documentConstants
      _.each(facilityObject[eachFacilityType], (each, i) => {
          // console.log('in get_initialvalues_object-fixed-term-contract, facilityMethod in each each, p, facilityObject, eachFacilityType, facilityObject[eachFacilityType], each: ', p, facilityObject, eachFacilityType, facilityObject[eachFacilityType], each);
        facilityUsageFeeSum += each.price_per_month;
        if (eachFacilityType === p.object.base_key && (i === facilityObject[eachFacilityType].length - 1)) facilityIdNumbers += each.facility_number;
        // if (eachFacilityType === p.object.base_key && i === facilityObject[eachFacilityType].length - 1) facilityIdNumbers.concat(each.facility_number);
        if (eachFacilityType === p.object.base_key && (i < facilityObject[eachFacilityType].length - 1)) facilityIdNumbers = facilityIdNumbers + each.facility_number + ', ';
        // if (eachFacilityType === p.object.base_key && i < facilityObject[eachFacilityType].length - 1) facilityIdNumbers.concat(`${each.facility_number},`);
        if (eachFacilityType === p.object.base_key) facilitySpaces++;
        // facilitySpaces++
      });
    });
    eachChoice = documentConstants.facility.facility_type.choices[p.object.base_key];
    // console.log('in get_initialvalues_object-fixed-term-contract, facilityMethod, p, p.object.name, facilityObject, eachChoice, facilityIdNumbers, facilitySpaces: ', p, p.object.name, facilityObject, eachChoice, facilityIdNumbers, facilitySpaces);
    // Match return condition of each choice to the key given to the method
    if (p.key === 'facilities_usage_fee') return facilityUsageFeeSum;
    if (p.key === eachChoice.documentFormMap1) return facilitySpaces;
    if (p.key === eachChoice.documentFormMap2) return facilityIdNumbers;
  };

  const profileMethod = (p) => {
    // Get userOwner or tenant record based on object.record
    const record = p.object.record === 'user_owner' ? userOwner : tenant;
    // What language is the object for base or translation
    const language = p.object.translation_object ? translationLanguageCode : baseLanguageCode;
    // Get profile from array of profiles based on language
    const profile = getProfile(record.profiles, language);
    // If language is jp, order names last name first
    let fullName = profile.last_name ? profile.first_name.concat(` ${profile.last_name}`) : '';
    if (language === 'jp') fullName = profile.last_name ? profile.last_name.concat(` ${profile.first_name}`) : '';

    // return userOwner[p.key];
    let fullAddress = profile.address1 + ', ' + profile.city + ', ' + profile.state + ', ' + profile.zip;
    if (profile.country.toLowerCase() === ('japan' || '日本'　|| '日本国') && language === 'jp') {
      fullAddress = ''
      fullAddress = fullAddress.concat(`${profile.zip}${profile.state}${profile.city}${profile.address1}`);
      objectReturned.owner_address = fullAddress;
    }
    // return initialValues with conditions
    if (p.key === 'owner_name' || p.key === 'owner_name_translation' || p.key === 'tenant_name') return fullName;
    if (p.key === 'owner_phone' || p.key === 'tenant_phone') return profile.phone;
    if (p.key === 'owner_address' || p.key === 'owner_address_translation') return fullAddress;
    if (p.key === 'owner_company' || p.key === 'owner_company_translation') return profile.name;
    if (p.key === 'tenant_age' && profile.birthday) return calculateAge(profile.birthday);

    return profile[p.key];
  };

  const tenantMethod = (p) => {
    // Get the tenant from booking.tenants by index
    // i.e. 'group' from documentConstants.tenants[each key]
    // console.log('in get_initialvalues_object-fixed-term-contract, profileMethod, p.key, p, documentConstants: ', p.key, p, documentConstants);
    if (p.key !== 'co_tenants') {
      const tenantRecord = p.record[documentConstants.tenants[p.key].group];
      // then get the column from each booking.tenants[index]
      return tenantRecord ? tenantRecord[documentConstants.tenants[p.key].tenantObjectMap] : null;
    }
    // Get if co_tenant the number of co-tenants i.e. booking.tenants.length
    if (p.key === 'co_tenants') return p.record.length;
  };

  const managementBrokerMethod = (p) => {
    // This method assumes management is same as broker;
    // In reality they usually are but sometimes not in retail;
    // And there could be multiple brokers
    // return flat[p.key];
    // Get contract from p.record booking.contracts array
    const contractArray = p.record.filter((cont) => cont.work_type === p.contractorType);
    const language = p.object.translation_object ? translationLanguageCode : baseLanguageCode;
    let contractorForLanguage = getManagement(contractArray[0].contractor_all_languages, language);
    contractorForLanguage = contractorForLanguage || {};
    // In case getManagement returns null;

    let staffForLanguage = getManagement(contractArray[0].assignments[0].staff_all_languages, language);
    staffForLanguage = staffForLanguage || {};
    // In case getManagement returns null;

    if (p.key === 'management_address'
          || p.key === 'management_address_translation'
          || p.key === 'broker_address_hq'
          || p.key === 'broker_address_hq_translation'
        ) return createAddress(contractorForLanguage);
    if (p.key === 'management_company'
          || p.key === 'management_company_translation'
          || p.key === 'broker_company_name'
          || p.key === 'broker_company_name_translation'
        ) return contractorForLanguage.company_name;
    if (p.key === 'management_name'
          || p.key === 'management_name_translation'
          || p.key === 'broker_representative_name'
          || p.key === 'broker_representative_name_translation'
        ) return language === 'jp' ? contractorForLanguage.last_name + ' ' + contractorForLanguage.first_name : contractorForLanguage.first_name + ' ' + contractorForLanguage.last_name;
    if (p.key === 'management_phone') return contractArray[0].contractor.phone;
    if (p.key === 'management_registration_number' || p.key === 'broker_registration_number') return contractArray[0].contractor.registration_number;
    if (p.key === 'management_registration_number_front' || p.key === 'broker_registration_front_number') return contractArray[0].contractor.registration_number_front;

    if (p.key === 'broker_registration_jurisdiction' || p.key === 'broker_registration_jurisdiction_translation') return contractorForLanguage.registration_jurisdiction;
    if (p.key === 'broker_registration_grantor') return contractorForLanguage.registration_grantor;

    if (p.key === 'broker_staff_name' || p.key === 'broker_staff_name_translation') return language === 'jp' ? staffForLanguage.last_name + ' ' + staffForLanguage.first_name : staffForLanguage.first_name + ' ' + staffForLanguage.last_name;;
    if (p.key === 'broker_staff_registration') return contractArray[0].assignments[0].staff.registration;
    if (p.key === 'broker_staff_registration_jurisdiction' || p.key === 'broker_staff_registration_jurisdiction_translation') return staffForLanguage.registration_jurisdiction;
    if (p.key === 'broker_staff_address' || p.key === 'broker_staff_address_translation') return createAddress(staffForLanguage);
    if (p.key === 'broker_staff_phone') return staffForLanguage.phone;

    if (p.key === 'contract_work_sub_type') return contractArray[0].work_sub_type;
    // if (p.key === 'broker_registration_jurisdiction_translation') return contractArray[0].registration_number_front;
  };

  const documentMethod = (p) => {
    function getContractDate(key) {
      const contractDate = new Date();
      const contractYear = key === 'contract_year' ? contractDate.getFullYear() : null;
      const contractMonth = key === 'contract_month' ? contractDate.getMonth() + 1 : null;
      const contractDay = key === 'contract_day' ? contractDate.getDate() : null;
      return { contract_year: contractYear, contract_month: contractMonth, contract_day: contractDay}
    }

    if (p.key === 'contract_year') return getContractDate(p.key)[p.key];
    if (p.key === 'contract_month') return getContractDate(p.key)[p.key];
    if (p.key === 'contract_day') return getContractDate(p.key)[p.key];
    return p.record[p.key];
  };

  const inspectionMethod = (p) => {
    function getIfDegradationExists(inspection) {
      // if Any of inspection.degrations is true return true
      let returnValue = false;
      // .some function returns immediately when there is a positive match for yes
      Object.keys(inspection.degradations).some((eachPartKey) => {
        if (inspection.degradations[eachPartKey] === 'yes') {
          returnValue = true;
          return returnValue;
        }
      });
      return returnValue;
    }
    // Get inspections the latest and the same date
    const latestLanguageMappedInspections = getLatestSameDate(p.record);
    // if translation object, then get the inspection for that languge or the english one
    let inspectionForLanguage = p.object.translation_object
                                ?
                                latestLanguageMappedInspections[translationLanguageCode] || latestLanguageMappedInspections.en
                                :
                                latestLanguageMappedInspections[baseLanguageCode];

    if (!inspectionForLanguage) inspectionForLanguage = latestLanguageMappedInspections[Object.keys(latestLanguageMappedInspections)[0]]


    let key = p.key;
    // If the object is a translation object take off _translation for key
    if (p.object.translation_object) {
      key = p.key.split('_');
      // key.splice(key.length - 1, 1).join('_');
      key.splice(-1, 1);
      key = key.join('_');
    }
    // If the p.key is different from object.name, use actual_record_key
    if (p.object.actual_record_key) {
      key = p.object.actual_record_key;
    }
    console.log('in get_initialvalues_object-fixed-term-contract, inspectionMethod, p.key, key, latestLanguageMappedInspections, inspectionForLanguage: ', p.key, key, latestLanguageMappedInspections, inspectionForLanguage);
    // If this method runs, that means there was an inspection on record
    if (p.key === 'building_inspection_conducted') return true;
    if (p.key === 'degradation_exists_wooden' || p.key === 'degradation_exists_concrete') return getIfDegradationExists(inspectionForLanguage);

    return inspectionForLanguage[key];
  };
  // const flatMethod = (p) => {
  //   return p.record[p.key];
  // };

  const methodObject = {
    document: {
      method: documentMethod,
      parameters: { record: agreement },
      condition: agreement
    },

    building: {
      method: recordWithLanguagesArrayMethod,
      parameters: { baseRecord: flat.building, baseRecordName: 'building' },
      condition: flat.building
    },

    flat: {
      method: recordWithLanguagesArrayMethod,
      parameters: { baseRecord: flat, baseRecordName: 'flat' },
      condition: flat
    },

    address: {
      method: recordWithLanguagesArrayMethod,
      parameters: { baseRecord: flat, baseRecordName: 'flat', address: true },
      condition: flat
    },

    amenity: {
      method: (p) => {
        return flat.amenity[p.key];
      },
      parameters: {},
      condition: flat.amenity
    },

    list: {
      method: getListValues,
      parameters: { flat, templateMappingObjects, agreements: [agreement] },
      condition: flat.amenity
    },

    bankAccount: {
      method: getSingleObjectValue,
      parameters: { record: flat.bank_account, hideKey: 'account_number', hideText: '***' },
      condition: flat && flat.bank_account
    },

    booking: {
      method: bookingMethod,
      parameters: { record: booking },
      condition: booking
    },

    facility: {
      method: facilityMethod,
      parameters: { record: booking },
      condition: booking.facility_bookings.length > 0
    },
    // Note: owner the user for flat for booking; Not necessarily the legal owner of the flat
    // userOwner is flat.user; tenant is booking.user
    profile: {
      method: profileMethod,
      parameters: {},
      condition: userOwner.profiles.length > 0 || tenant.profiles.length > 0
    },

    tenant: {
      method: tenantMethod,
      parameters: { record: booking.tenants },
      condition: booking.tenants.length > 0
    },
    // management is the broker managing the rental (booking.contracts...contractor);
    // Not the flat.user (the landlord)
    management: {
      method: managementBrokerMethod,
      parameters: { record: booking.contracts, contractorType: 'rental_broker', workSubType: 'broker' },
      condition: booking.contracts.length > 0
    },

    inspection: {
      method: inspectionMethod,
      parameters: { record: flat.building.inspections },
      condition: flat.building.inspections.length > 0
    },
  };
  console.log('in get_initialvalues_object-fixed-term-contract, flat, agreement, documentLanguageCode, agreement.language_code, documentConstants, userOwner, tenant: ', flat, agreement, documentLanguageCode, agreement.language_code, documentConstants, userOwner, tenant);
  const baseLanguageCode = agreement.language_code || 'jp';
  const translationLanguageCode = documentLanguageCode || 'en';
  let objectReturned = {};
  // object to be used in handleFormSubmit
  const allFields = {};
  // let eachField = null;
  let allObjectEach = null;
  let keyExistsInMethodObject = false;
  let conditionTrue = false;
  let count = 0;
  let countAll = 0;

  if (template) {
    // let objectReturnedSub = {}
    // Iterate through documentFields; For template elements it's state.documents.templateElements
    _.each(documentFields, eachField => {
      countAll++;
      // Get object from all object fixed term and important points
      allObjectEach = allObject[eachField.name];
      keyExistsInMethodObject = allObjectEach
                                && methodObject[allObjectEach.initialvalues_method_key];
      conditionTrue = allObjectEach
                      && methodObject[allObjectEach.initialvalues_method_key]
                      && methodObject[allObjectEach.initialvalues_method_key].condition;

      // The below sends key and object as default
      // and the rest of the parameters are derieed from methodObject
      if (keyExistsInMethodObject && conditionTrue) {
        count++;
        objectReturned = { ...objectReturned, [eachField.name]: methodObject[allObjectEach.initialvalues_method_key].method({ ...methodObject[allObjectEach.initialvalues_method_key].parameters, key: eachField.name, object: allObjectEach }) };
      }
      // Code for list elements eg amenities_list amenties_list_translation
      // list elements do not have an all object and has list parameters in eachField,
      // eg. list_parameters: fixed_term_rental_contract_bilingual,translation,amenities,true,bath_tub,shower,ac,auto_lock
      conditionTrue = allObjectEach
      // conditionTrue = !allObjectEach
                      && eachField.list_parameters
                      && methodObject.list
                      && methodObject.list.condition;
      if (conditionTrue) {
        count++;
        objectReturned = { ...objectReturned, [eachField.name]: methodObject.list.method({ ...methodObject.list.parameters, listElement: eachField, documentLanguageCode: translationLanguageCode }) };
      }
      // console.log('in get_initialvalues_object-fixed-term-contract-template, getInitialValuesObject, documentFields, eachField, allObjectEach, allObject: ', documentFields, eachField, allObjectEach, allObject);
      console.log('in get_initialvalues_object-fixed-term-contract-template, getInitialValuesObject, eachField, eachField.name, count, countAll: ', eachField, eachField.name, count, countAll);
    });
  } else {

  }
  // !!!!!!!!!end of documentForm eachField

  console.log('in get_initialvalues_object-fixed-term-contract-template, getInitialValuesObject, objectReturned, count, countAll, template: ', objectReturned, count, countAll, template);
  // return objectReturned for assignment to initialValues in mapStateToProps
  return { initialValuesObject: objectReturned, allFields };
// }
};
