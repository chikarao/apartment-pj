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
  const { flat, booking, userOwner, tenant, appLanguageCode, documentFields, agreement, documentKey, documentLanguageCode, contractorTranslations, staffTranslations } = props;

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

  function getManagement(contractorArray, language) {
    let returnedProfile = {};
    _.each(contractorArray, eachContractor => {
      _.each(eachContractor, each => {
        if (each.language_code == language) {
          returnedProfile = each;
          return;
        }
      });
    });
    return returnedProfile;
  }
  // takes booking and creates object of start date and end date years, months and days
  // function getBookingDateObject(booking) {
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, booking: ', booking);
  //   const bookingEndArray = booking.date_end.split('-')
  //   const bookingStartArray = booking.date_start.split('-')
  //   const to_year = bookingEndArray[0];
  //   const to_month = bookingEndArray[1];
  //   const to_day = bookingEndArray[2];
  //   const from_year = bookingStartArray[0];
  //   const from_month = bookingStartArray[1];
  //   const from_day = bookingStartArray[2];
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, bookingEndArray: ', bookingEndArray);
  //   const object = { to_year, to_month, to_day, from_year, from_month, from_day }
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, object: ', object);
  //   return object;
  // }

  // function getContractLength(booking) {
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, booking: ', booking);
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
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, months, years: ', months, years);
  //   const object = { months, years };
  //   // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, object: ', object);
  //   return object;
  // }

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
    if (flat.country.toLowerCase() == ('japan' || '日本' || '日本国' || 'japon')) {
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
    let objectReturned;
    _.each(languages, eachLanguage => {
      console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage languages, languageCode: ', languages, languageCode);
      if (eachLanguage.language_code == languageCode) {
        objectReturned = eachLanguage;
        return;
      }
    });
    console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, getLanguage objectReturned: ', objectReturned);
    return objectReturned;
  }

  function setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned }) {
    console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned: ', baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned);
    if (baseRecord.language_code == Documents[documentKey].baseLanguage) {
      // get building language for use translated field;
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = Documents base recordLanguage, documentLanguageCode: ', recordLanguage, documentLanguageCode);
      // assign buildingLangugae value to translated field
      objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      objectReturned[eachFieldKey] = baseRecord[eachPageObject[eachFieldKey].translation_column];
    } else if (baseRecord.language_code == documentLanguageCode) {
      // if building language code is different from base language for document
      // give translated field the baseRecord value
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, baseRecord[eachPageObject[eachFieldKey].translation_column]);
      objectReturned[eachPageObject[eachFieldKey].translation_field] = baseRecord[eachPageObject[eachFieldKey].translation_column];
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode recordLanguage, Documents[documentKey].baseLanguage: ', recordLanguage, Documents[documentKey].baseLanguage);
      if (!_.isEmpty(recordLanguage)) {
        console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, setLanguage if baseRecord = documentLanguageCode eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]: ', eachFieldKey, eachPageObject[eachFieldKey].translation_column, recordLanguage, recordLanguage[eachPageObject[eachFieldKey].translation_column]);
        objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      }
    } else {
      const recordLanguage = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], Documents[documentKey].baseLanguage);
      const recordLanguage1 = getLanguage(baseRecord[eachPageObject[eachFieldKey].translation_record], documentLanguageCode);
      objectReturned[eachFieldKey] = recordLanguage[eachPageObject[eachFieldKey].translation_column];
      objectReturned[eachPageObject[eachFieldKey].translation_field] = recordLanguage1[eachPageObject[eachFieldKey].translation_column];
    }
  }
    // object to return to create_edit_document.js
    const objectReturned = {};
    // object to be used in handleFormSubmit
    const allFields = {};

    _.each(documentFields, eachPageObject => {
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, eachPageObject: ', eachPageObject);
      // for each page in this.props.documentFields
      _.each(eachPageObject, (eachField, i) => {
        allFields[eachField.name] = i;
      });

      objectReturned.document_name = Documents[documentKey][documentLanguageCode]

      _.each(Object.keys(flat), key => {
        // for each flat in boooking
        if (eachPageObject[key]) {
          // if flat key is in one of the pages, on DocumentForm
          // add to objectReturned to be returned as initialValues
          objectReturned[key] = flat[key];
          if (eachPageObject[key].translation_column) {
            // if building language code equal base language for the document
            const baseRecord = flat;
            const eachRecordKey = key;
            // const eachFieldKey = eachPageObject[key].translation_column
            // fill translation field with translations
            setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
          }  // end of if translation column
        }
        // iterate through flat amenity
        // end of each flat amenity
      });

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

      // if flat_owner_name is user use the user profile for user
      // if (flat.owner_name && !eachPageObject.flat_owner_name.translation_column) {
      //   // const ownerFullName = ownerProfile.last_name.concat(` ${ownerProfile.first_name}`);
      //   // objectReturned.flat_owner_name = ownerFullName;
      //   // objectReturned.flat_owner_address = createAddress(ownerProfile);
      //   // objectReturned.flat_owner_phone = ownerProfile.phone;
      //   objectReturned.flat_owner_name = flat.owner_contact_name;
      //   objectReturned.flat_owner_company_name = flat.owner_name;
      //   objectReturned.flat_owner_address = flat.owner_address;
      //   objectReturned.flat_owner_phone = flat.owner_phone;
      // }
        // else use the owner in flat

      // end of Object.keys flat
      _.each(Object.keys(flat.amenity), eachAmenityKey => {
        if (eachPageObject[eachAmenityKey]) {
          // if attributes in flat.amenity are on DocumentForm, add to initialValues objectReturned
          objectReturned[eachAmenityKey] = flat.amenity[eachAmenityKey];
        }
      });
      // end of each Object.keys flat.amenity
      if (flat.building) {
        // test if building has been added to flat
        _.each(Object.keys(flat.building), eachBuildingKey => {
          // if (eachBuildingKey == 'name') {
          //   eachBuildingKey = 'flat_building_name';
          // }
          if (eachPageObject[eachBuildingKey]) {
            // if attributes in flat.building are on DocumentForm, add to initialValues objectReturned
            objectReturned[eachBuildingKey] = flat.building[eachBuildingKey];
            // if key is for a translated field
            if (eachPageObject[eachBuildingKey].translation_column) {
              // if building language code equal base language for the document
              const baseRecord = flat.building;
              const eachRecordKey = eachBuildingKey;
              const eachFieldKey = eachPageObject[eachBuildingKey].translation_column
              // fill translation field with translations
              setLanguage({ baseRecord, eachPageObject, eachFieldKey, eachRecordKey, objectReturned });
            } // end of if translation column
          }
        });
        // end of each Object.keys flat.building
      }

      if (flat.bank_account) {
        // test if bank_account has been added to flat
        _.each(Object.keys(flat.bank_account), eachBankAccountKey => {
          // if (eachBuildingKey == 'name') {
          //   eachBuildingKey = 'flat_bank_account_name';
          // }
          if (eachPageObject[eachBankAccountKey]) {
            // if attributes in flat.bank_account are on DocumentForm, add to initialValues objectReturned
            // if key is account_number, add *** to initial value
            if (eachBankAccountKey == 'account_number') {
              objectReturned[eachBankAccountKey] = flat.bank_account[eachBankAccountKey] + '***'
            } else {
              objectReturned[eachBankAccountKey] = flat.bank_account[eachBankAccountKey];
            }
          }
        });
      }
      // CALCULATED fields on document
      // set payment due date for fees same as rent payment due date
      if (flat.payment_due_date) {
        objectReturned.fees_payment_due_date = flat.payment_due_date;
      }

      if (flat.deposit) {
        objectReturned.deposit_amount = (flat.price_per_month * flat.deposit);
      }

      if (flat.price_per_month) {
        // convert float to integer by multiplying flat by integer
        objectReturned.price_per_month = (flat.price_per_month * 1);
      }

      // handle rent_payment_method;
      if (flat.rent_payment_method) {
        // if bank transfer, nothing filled on the place to deliver rent line
        if (flat.rent_payment_method == 'bank_transfer') {
          objectReturned.rent_payment_method = '';
        } else {
          // if not bank transfer, get the choice from the constants objectReturned
          let choice = {}
          // get the choice with the value ==
          _.each(RentPayment.rent_payment_method.choices, eachChoice => {
            if (eachChoice.value == flat.rent_payment_method) {
              // if match record in flat, assign to choice
              choice = eachChoice;
            }
          })
          // if choice is empty, user has entered own method
          if (!_.isEmpty(choice)) {
            // if standard input other than bank transfer, assign method to objectReturned
            // get language jp or en
            objectReturned.rent_payment_method = choice[appLanguageCode]
          } else {
            // if empty, it is own entry so assign to objct
            objectReturned.rent_payment_method = flat.rent_payment_method;
          }
          // if not bank transfer, do not put rectangle on transfer fee paid by
          objectReturned.transfer_fee_paid_by = '';
        }
        // end of else
      }
      // end of if flat.rent_payment_method
      // calculate number of facilties, car park, bicycle parking, etc
      // and get a string of their numbers 1A, 2D etc.
      if (eachPageObject.facility_type) {
        if (booking.facilities) {
          // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, flat.facilities: ', flat.facilities);
          // set up arrays for each facility
          const carParkingArray = [];
          const bicycleParkingArray = [];
          const motorcycleParkingArray = [];
          const storageArray = [];
          // set up array of each array;
          const facilityArray = [carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray];
          // const yardArray = []
          // specify which facility_types should be iterated over
          const facilityTypes = ['car_parking', 'bicycle_parking', 'motorcycle_parking', 'storage'];
          // iterate through each facility.js facility_type choices
          _.each(Facility.facility_type.choices, eachChoice => {
            // iterate over each facility assigned to flat
            _.each(booking.facilities, eachFacility => {
              if (eachFacility.facility_type == eachChoice.value && facilityTypes.includes(eachFacility.facility_type)) {
                // if there is a facility that match the choices and the types that we care about
                // push them in respective arrays
                eachFacility.facility_type == 'car_parking' ? carParkingArray.push(eachFacility) : '';
                eachFacility.facility_type == 'bicycle_parking' ? bicycleParkingArray.push(eachFacility) : '';
                eachFacility.facility_type == 'motorcycle_parking' ? motorcycleParkingArray.push(eachFacility) : '';
                eachFacility.facility_type == 'storage' ? storageArray.push(eachFacility) : '';
                // eachFacility.facility_type == 'dedicated_yard' ? yardArray.push(eachFacility) : '';
              }
            })
          })
          // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, facilityArray: ', facilityArray);
          // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray: ', carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray);
          // facilityUsageFeeCount to calculate total of all facilities to charge
          let facilityUsageFeeCount = 0;
          // iterate over each array in array of of arrays
          _.each(facilityArray, eachArray => {
            // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, eachArray: ', eachArray);
            // if an array has something in it, count how many and form their strings
            if (eachArray.length > 0) {
              // count for how many spaces (parking, bicycle, motorcyle)
              let count = 0;
              // facilitySpaces for string showing space numbers 1A, 2B etc
              let facilitySpaces = ''
              _.each(eachArray, each => {
                // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, each: ', each);
                // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, each: ', each);
                // forms string with facility numbers eg 1A, 2B etc
                if (count > 0) {
                  facilitySpaces = facilitySpaces.concat(', ')
                  facilitySpaces = facilitySpaces.concat(each.facility_number)
                  // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, facilitySpaces, count if > 0: ', facilitySpaces, count);
                  count++;
                } else {
                  facilitySpaces = facilitySpaces.concat(each.facility_number)
                  // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, facilitySpaces, count else: ', facilitySpaces, count);
                  count++;
                }
                // get the choice that corresponds to each facility in facility types
                const choiceInEach = getChoice(each);
                // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]: ', choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]);
                // if facility NOT included, add up price_per_month
                if (!flat[choiceInEach.facilityObjectMap]) {
                  facilityUsageFeeCount += each.price_per_month;
                }
              })
              // get the choice that corresponds to the facility_type
              const choice = getChoice(eachArray[0]);
              // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, choice: ', choice);
              // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, count, facilitySpaces, choice: ', count, facilitySpaces, choice);
              //set each parking_spaces and parking_space_number for car, bicycle, motorcycle and storage
              // for some reason, parking_spaces gets assigned '0' in form initial, so assign empty string to start,
              // then when choice is selected, assign a number.
              // objectReturned.parking_spaces = '';
              objectReturned[choice.documentFormMap1] = count;
              // objectReturned[choice.documentFormMap1] = ((count > 0) ? count : '');
              objectReturned[choice.documentFormMap2] = facilitySpaces;
              objectReturned.facilities_usage_fee = facilityUsageFeeCount;
            }
          });
        }
      } // end of if (eachPageObject.facility_type)

      // const language = 'jp'
      const language = Documents[documentKey].baseLanguage;
      const ownerProfile = getProfile(userOwner.profiles, language);
      const ownerProfileTranslation = getProfile(userOwner.profiles, documentLanguageCode);
      const tenantProfile = getProfile(booking.user.profiles, language);
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, ownerProfile, userOwner.profiles: ', ownerProfile, userOwner.profiles);
      // form string for user owner names
      if (ownerProfile.first_name && ownerProfile.last_name) {
        const fullName = ownerProfile.last_name.concat(` ${ownerProfile.first_name}`);
        objectReturned.owner_name = fullName;
        objectReturned.owner_phone = ownerProfile.phone;
      }

      if (ownerProfileTranslation.first_name && ownerProfileTranslation.last_name) {
        const fullName = ownerProfileTranslation.last_name.concat(` ${ownerProfileTranslation.first_name}`);
        objectReturned.owner_name_translation = fullName;
      }
      // form string for address of user owner
      if (ownerProfile.address1 && ownerProfile.city) {
        if (ownerProfile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
          let fullAddress = ''
          fullAddress = fullAddress.concat(`${ownerProfile.zip}${ownerProfile.state}${ownerProfile.city}${ownerProfile.address1}`);
          objectReturned.owner_address = fullAddress;
        }
      }

      if (ownerProfileTranslation.address1 && ownerProfileTranslation.city) {
        if (ownerProfileTranslation.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
          let fullAddress = ''
          fullAddress = fullAddress.concat(`${ownerProfileTranslation.address1} ${ownerProfileTranslation.city} ${ownerProfileTranslation.state} ${ownerProfileTranslation.zip} ${ownerProfileTranslation.country}`);
          objectReturned.owner_address_translation = fullAddress;
        }
      }
      objectReturned.owner_company = ownerProfile.name;
      objectReturned.owner_company_translation = ownerProfileTranslation.name;
      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, contractorTranslations, staffTranslations: ', contractorTranslations, staffTranslations);

      // language comes from Documents[documentKey].baseLanguage
      if (eachPageObject.management_name) {
        // get managment company profile from contractorTranslations state object
        const managementProfile = getManagement(contractorTranslations, language);
        const managementProfileTranslation = getManagement(contractorTranslations, documentLanguageCode);
        // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, managementProfile, managementProfileTranslation: ', managementProfile, managementProfileTranslation);
        objectReturned.management_company = managementProfile.company_name;
        objectReturned.management_company_translation = managementProfileTranslation.company_name;
        objectReturned.management_phone = managementProfile.phone;
        const fullName = managementProfile.last_name.concat(` ${managementProfile.first_name}`);
        objectReturned.management_name = fullName;
        const fullNameTranslation = managementProfileTranslation.last_name.concat(` ${managementProfileTranslation.first_name}`);
        objectReturned.management_name_translation = fullNameTranslation;
        if (managementProfile.language_code = Documents[documentKey].baseLanguage) {
          objectReturned.management_registration_number_front = managementProfileTranslation.registration_number_front;
          objectReturned.management_registration_number = managementProfileTranslation.registration_number;
        } else {
          objectReturned.management_registration_number_front = managementProfile.registration_number_front;
          objectReturned.management_registration_number = managementProfile.registration_number;
        }

        if (managementProfile.address1 && managementProfile.city) {
          if (managementProfile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            fullAddress = fullAddress.concat(`${managementProfile.address1} ${managementProfile.city} ${managementProfile.state} ${managementProfile.zip} ${managementProfile.country}`);
            objectReturned.management_address = fullAddress;
          }
        }

        if (managementProfileTranslation.address1 && managementProfileTranslation.city) {
          if (managementProfileTranslation.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
            let fullAddress = ''
            fullAddress = fullAddress.concat(`${managementProfileTranslation.address1} ${managementProfileTranslation.city} ${managementProfileTranslation.state} ${managementProfileTranslation.zip} ${managementProfileTranslation.country}`);
            objectReturned.management_address_translation = fullAddress;
          }
        }
      }

      if (booking.tenants) {
        let count = 0;
        _.each(booking.tenants, (eachTenant) => {
          _.each(Object.keys(Tenants), (eachTenantKey, i) => {
            // const keys = Object.keys(eachTenant);
            const keys = ['name', 'age'];
            _.each(keys, key => {
              if ((count == Tenants[eachTenantKey].group) && (key == Tenants[eachTenantKey].tenantObjectMap)) {
                // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, eachTenant, key, eachTenantKey: ', eachTenant, key, eachTenantKey);
                objectReturned[eachTenantKey] = eachTenant[key];
              }
            })
          })
          count++;
        });
        objectReturned.co_tenants = booking.tenants.length;
      }

      // form string for user tenant names
      if (tenantProfile.first_name && tenantProfile.last_name) {
        const fullName = tenantProfile.last_name.concat(` ${tenantProfile.first_name}`);
        objectReturned.tenant_name = fullName;
        objectReturned.tenant_phone = tenantProfile.phone;
      }


      // form get age of tenant
      if (tenantProfile.birthday) {
        const age = calculateAge(tenantProfile.birthday);
        objectReturned.tenant_age = age;
      }

      // if (flat.building.building_owner_name) {
      //   objectReturned.building_owner_name = flat.building.building_owner_name;
      //   objectReturned.building_owner_address = flat.building.building_owner_address;
      //   objectReturned.building_owner_phone = flat.building.building_owner_phone;
      // }

      // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, tenantProfile: ', tenantProfile);
      if (tenantProfile.emergency_contact_name) {
        objectReturned.emergency_contact_name = tenantProfile.emergency_contact_name;
        objectReturned.emergency_contact_phone = tenantProfile.emergency_contact_phone;
        objectReturned.emergency_contact_address = tenantProfile.emergency_contact_address;
        objectReturned.emergency_contact_relationship = tenantProfile.emergency_contact_relationship;
      }


        // end of each Object.keys flat.bank_account
      // end of if flat.building
      // !!!!!after going through each by each flat, amenity and building,
      // go through page objectReturned to see if document objectReturned (page) has 'attributes'
      // set by multipe amenity keys
      // _.each(Object.keys(eachPageObject), documentPageKey => {
      //   // iterate through each page objectReturned key
      //   if ('attributes' in eachPageObject[documentPageKey]) {
      //     // if attributes key is in one of the objectReturneds in one of the pages
      //     // take each name in names array and get the value of that key in amenity
      //     // count up a counter if one of the amenities is true
      //     let attributeBoolCount = 0;
      //     _.each(eachPageObject[documentPageKey].attributes.names, eachName => {
      //       console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, each attributes eachName, flat.amenity[eachName]: ', eachName, flat.amenity[eachName]);
      //       if (flat.amenity[eachName]) {
      //         attributeBoolCount++;
      //       }
      //     });
      //     if (attributeBoolCount > 0) {
      //       objectReturned[documentPageKey] = true;
      //     } else {
      //       objectReturned[documentPageKey] = false;
      //     }
      //   }
      // });
      // deal with booking dates dates (separates year, month and day of to and from attributes)
      const bookingDatesObject = getBookingDateObject(booking);
      _.each(Object.keys(bookingDatesObject), dateKey => {
        objectReturned[dateKey] = bookingDatesObject[dateKey];
      });
      // end of each bookingDatesObject
      // get address1, city, state, zip in one string
      const address = createAddress(flat);
      // add address to initialvalues objectReturned
      if (eachPageObject.address) {
        objectReturned.address = address;
        if (eachPageObject.address.translation_field) {
          if (flat.language_code == Documents[documentKey].baseLanguage) {
            const recordLanguage = getLanguage(flat[eachPageObject.address.translation_record], documentLanguageCode);
            const addressTranslation = createAddress(recordLanguage);
            objectReturned[eachPageObject.address.translation_field] = recordLanguage;
          } else if (flat.language_code == documentLanguageCode) {
            const recordLanguage = getLanguage(flat[eachPageObject.address.translation_record], Documents[documentKey].baseLanguage);
            const addressTranslation = createAddress(recordLanguage);
            // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, addressTranslation: ', addressTranslation);
            objectReturned.address = addressTranslation;
            // console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, eachPageObject.address: ', eachPageObject.address);
            objectReturned[eachPageObject.address.translation_field] = address;
          } else {
            const recordLanguage = getLanguage(flat[eachPageObject.address.translation_record], Documents[documentKey].baseLanguage);
            const recordLanguage1 = getLanguage(flat[eachPageObject.address.translation_record], documentLanguageCode);
            objectReturned.address = recordLanguage;
            objectReturned[eachPageObject.address.translation_field] = recordLanguage1;
          }
        }
      }


      // get contract length objectReturned with years and months
      const contractLengthObject = getContractLength(booking);
      objectReturned.contract_length_years = contractLengthObject.years;
      objectReturned.contract_length_months = contractLengthObject.months;

      if (contractLengthObject.years >= 1) {
        const contractEndNoticePeriodObject = getContractEndNoticePeriodObject(booking);
        objectReturned.notice_from_year = contractEndNoticePeriodObject.from.year;
        objectReturned.notice_from_month = contractEndNoticePeriodObject.from.month;
        objectReturned.notice_from_day = contractEndNoticePeriodObject.from.day;
        objectReturned.notice_to_year = contractEndNoticePeriodObject.to.year;
        objectReturned.notice_to_month = contractEndNoticePeriodObject.to.month;
        objectReturned.notice_to_day = contractEndNoticePeriodObject.to.day;
      }
    });
    // end of documentForm eachPageObject

    console.log('in get_initialvalues_object-fixed-term-contract, getInitialValuesObject, objectReturned: ', objectReturned);
    // return objectReturned for assignment to initialValues in mapStateToProps
    return { initialValuesObject: objectReturned, allFields };
  // }
};
// breaks text with reverse slash n into separate lines
// export default (props) => {
//   // console.log('in messaging, multi_line_text, props: ', props);
//   const textArray = props.text.split('\n');
//   // console.log('in messaging, multi_line_text, textArray: ', textArray);
//   function renderEachLine() {
//     return _.map(textArray, (eachLine, i) => {
//       return <span key={i} >{eachLine}<br/></span>;
//     });
//   }
//
//   return <div>{renderEachLine()}</div>;
// };
