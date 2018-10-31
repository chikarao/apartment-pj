import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';

import AppLanguages from './constants/app_languages';
import Facility from './constants/facility';
import Profile from './constants/profile';
import Tenants from './constants/tenants';

class BookingRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedFacilityArray: []
    };
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this);
  }
  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    // const bookingId = parseInt(this.props.match.params.id, 10);
    // this.props.fetchBooking(bookingId);
    // this.props.fetchReviewForBookingByUser(bookingId);
    let bookingRequestUserEmail = '';
    let bookingRequestFlatId = '';
    let bookingRequestTo = '';
    let bookingRequestFrom = '';

    const bookingRequestEmpty = _.isEmpty(this.props.bookingRequest);

    if (!bookingRequestEmpty) {
      localStorage.setItem('bookingRequestTo', this.props.bookingRequest.date_end);
      localStorage.setItem('bookingRequestFrom', this.props.bookingRequest.date_start);
      localStorage.setItem('bookingRequestFlatId', this.props.bookingRequest.flat_id);
      localStorage.setItem('bookingRequestUserEmail', this.props.bookingRequest.user_email);
      bookingRequestTo = localStorage.getItem('bookingRequestTo');
      bookingRequestFrom = localStorage.getItem('bookingRequestFrom');
      bookingRequestUserEmail = localStorage.getItem('bookingRequestUserEmail');
      bookingRequestFlatId = localStorage.getItem('bookingRequestFlatId');
      // console.log('in booking_request, componentDidMount, in if !bookingRequestEmpty,   bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    } else {
      bookingRequestTo = localStorage.getItem('bookingRequestTo');
      bookingRequestFrom = localStorage.getItem('bookingRequestFrom');
      bookingRequestUserEmail = localStorage.getItem('bookingRequestUserEmail');
      bookingRequestFlatId = localStorage.getItem('bookingRequestFlatId');
      // console.log('in booking_request, componentDidMount, bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    }
    this.props.fetchProfileForUser(() => {});
  }

  componentDidUpdate() {
    this.addNonOptionalFacilityToState();
  }

  componentWillUnmount() {
    // console.log('in booking confirmation, componentWillUnmount');
    const bookingRequestTo = localStorage.removeItem('bookingRequestTo');
    const bookingRequestFrom = localStorage.removeItem('bookingRequestFrom');
    const bookingRequestFlatId = localStorage.removeItem('bookingRequestFlatId');
    const bookingRequestUserEmail = localStorage.removeItem('bookingRequestFlatId');
  }

  getFacilityObject(facility) {
    const object = {
      facility_type: facility.facility_type,
      id: facility.id,
      facility_number: facility.facility_number,
      price_per_month: facility.price_per_month,
      optional: false,
      facility_deposit: facility.facility_deposit
    };
    return object;
  }

  isFacilityInStateObject(facility) {
    let facilityIsInState = false;
    _.each(this.state.addedFacilityArray, eachStateFacility => {
      if (facility.id == eachStateFacility.id) {
        facilityIsInState = true;
        return;
      }
    });
    return facilityIsInState;
  }

  addNonOptionalFacilityToState() {
    if (this.props.flat) {
      _.each(this.props.flat.facilities, eachFacility => {
        const facilityObject = this.getFacilityObject(eachFacility);
        const facilityInState = this.isFacilityInStateObject(eachFacility);
        const facilityChoice = this.getFacilityChoice(eachFacility.facility_type);
        // console.log('in booking_request, addNonOptionalFacilityToState, facilityChoice: ', facilityChoice);
        // get whether facility included from props.flat mapped by Facility.js choice
        const facilityIncluded = this.props.flat[facilityChoice.facilityObjectMap];
        facilityObject.facility_included = facilityIncluded;
        if ((eachFacility.optional == false || facilityIncluded) && !facilityInState) {
          this.setState({
            addedFacilityArray: [...this.state.addedFacilityArray, facilityObject]
          }, () => {
            // console.log('in booking_request, addNonOptionalFacilityToState, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
          });
        }
      });
    }
  }

  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear()
  }

  renderEachDateLine() {
    const array = [
      { title: AppLanguages.bookingFrom[this.props.appLanguageCode] + ': ', data: this.formatDate(new Date(this.props.bookingRequest.date_start)) },
      { title: AppLanguages.bookingTo[this.props.appLanguageCode] + ': ', data: this.formatDate(new Date(this.props.bookingRequest.date_end)) },
    ];

    return _.map(array, (eachLine, i) => {
      return (
        <div key={i} className="booking-request-box-each-line">
          <div className="booking-request-box-each-line-title">
            {eachLine.title}
          </div>
          <div className="booking-request-box-each-line-data">
            {eachLine.data}
          </div>
        </div>
      );
    });
  }

  renderBookingInfo() {
    if (this.props.bookingRequest && this.props.flat) {
      return (
        <div>
          <div className="booking-request-box-title">{AppLanguages.bookingInfo[this.props.appLanguageCode]}</div>
          <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + this.props.flat.images[0].publicid + '.jpg'} alt="" />
          <div>{this.props.flat.area}</div>
          <div>{this.props.flat.description.toUpperCase()}</div>
          <div>{this.props.flat.city}</div>
          <div>{this.props.flat.state}</div>
          {this.renderEachDateLine()}
        </div>
      );
    }
  }

  getFacilityChoice(facilityType) {
    let facilityChoice = {};
    _.each(Facility.facility_type.choices, eachChoice => {
      if (eachChoice.value == facilityType) {
        facilityChoice = eachChoice;
        return;
      }
    });
    return facilityChoice;
  }

  handleOptionButtonClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    const elementNameSplit = elementName.split(',')
    console.log('in booking_request, handleOptionButtonClick, elementNameSplit: ', elementNameSplit);
    const facilityObject = {
      facility_type: elementNameSplit[0],
      facility_number: elementNameSplit[1],
      optional: elementNameSplit[2],
      price_per_month: elementNameSplit[3],
      id: parseInt(elementNameSplit[4], 10),
      facility_included: false,
      facility_deposit: elementNameSplit[5]
    };

    if (elementVal == 'yes') {
      this.setState({
        addedFacilityArray: [...this.state.addedFacilityArray, facilityObject]
      }, () => {
        console.log('in booking_request, handleOptionButtonClick, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
      })
    }
    // if button is to delete or value 'no', copy state array, get index of clicked facility
    // then set state with the new copied array that has one element taken out of index
    if (elementVal == 'no') {
      const array = [...this.state.addedFacilityArray];
      // need to have arrow function to keep context for using state
      const elementIndex = () => {
        let index = 0;
        if (this.state.addedFacilityArray.length > 0) {
          _.each(this.state.addedFacilityArray, (eachStateFacility, i) => {
            if (eachStateFacility.id == facilityObject.id) {
              index = i;
              return
            }
          })
        }
        return index;
      }
      // console.log('in booking_request, handleOptionButtonClick, elementIndex: ', elementIndex());
      // get index by running function elementIndex
      array.splice(elementIndex(), 1)
      this.setState({
        addedFacilityArray: array
      }, () => {
        console.log('in booking_request, handleOptionButtonClick, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
      })
    }
  }

  facilityButtonSwitch(facility, facilityString) {
    let optionButton = '';
    let optionCount = 0;
    // check if anything in state array
    if (this.state.addedFacilityArray.length > 0) {
      // if something in array, iterate through array and check
      _.each(this.state.addedFacilityArray, eachStateFacility => {
        // console.log('in booking_request, facilityButtonSwitch, facility, eachStateFacility: ', facility, eachStateFacility);
        // if any of the facilities in state array match then upcount the optionCount and return
        if (facility.id == eachStateFacility.id) {
          optionCount++;
          return;
        }
      });
    } else {
      // if addedFacilityArray is empty, there are no options added so display "add"
      optionButton = <div value="yes" name={facilityString} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>{AppLanguages.addOption[this.props.appLanguageCode]}</div>
    }
    // if facility is included in state array, or optionCount > 0 return no button
    if (optionCount > 0) {
      optionButton = <div value="no" name={facilityString} style={{ borderColor: 'red' }}className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>{AppLanguages.deleteOption[this.props.appLanguageCode]}</div>;
    } else {
      optionButton = <div value="yes" name={facilityString} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>{AppLanguages.addOption[this.props.appLanguageCode]}</div>
    }

    // console.log('in booking_request, facilityButtonSwitch, optionButton: ', optionButton);
    // return button element
    return optionButton;
  }

  getFacilityString(facility) {
    // use facilityArray instead of Object.keys(Facility) because of 'id'
    const facilityArray = ['facility_type', 'facility_number', 'optional', 'price_per_month', 'id', 'facility_deposit' ]
    // facilityString =  eachFacility.facility_type.toString() + ',' + eachFacility.facility_number.toString() + ',' + eachFacility.optional.toString() + ',' + eachFacility.price_per_month.toString() + ',' + eachFacility.id.toString() + ',' + eachFacility.facility_deposit.toString()
    // console.log('in booking_request, getFacilityString, facility: ', facility);
    let facilityString = ''
    _.each(facilityArray, (eachAttribute, i) => {
      if (facility[eachAttribute]) {
        console.log('in booking_request, getFacilityString, eachAttribute, facility[eachAttribute].toString(): ', eachAttribute, facility[eachAttribute].toString());
        facilityString = facilityString.concat(`${facility[eachAttribute].toString()},`)
      } else {
        facilityString = facilityString.concat(',')
        // console.log('in booking_request, getFacilityString, facilityString: ', facilityString);
      }
    });
    return facilityString;
  }

  renderEachFacility() {
    // <div value="no" name={eachFacility.facility_type} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Do not Add</div>
    let facilityString = ''
    if (this.props.flat) {
      // if there is flat in props, iterate through each facility to render each facility
      return _.map(this.props.flat.facilities, (eachFacility, i) => {
        // get the choice corresponding to the facility in constants/Facility.js
        const facilityChoice = this.getFacilityChoice(eachFacility.facility_type);
        // form the string to be sent to handleOptionButtonClick when user clicks to add or delete option
        facilityString = this.getFacilityString(eachFacility)
        // facilityString =  eachFacility.facility_type.toString() + ',' + eachFacility.facility_number.toString() + ',' + eachFacility.optional.toString() + ',' + eachFacility.price_per_month.toString() + ',' + eachFacility.id.toString() + ',' + eachFacility.facility_deposit.toString()
        console.log('in booking_request, renderEachFacility, facilityString: ', facilityString);
        //this.props.flat[facilityChoice.facilityObjectMap] to check if faciity included in price
        // check if price included or no deposit or price_per_month available
        return (
          <div key={i} >
            <div className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title">
                {facilityChoice[this.props.appLanguageCode]}
              </div>
              <div className="booking-request-box-each-line-data-long">
                <div className="booking-request-box-each-line-data-sib">
                {this.props.flat[facilityChoice.facilityObjectMap] || !eachFacility.price_per_month ? AppLanguages.priceIncluded[this.props.appLanguageCode] : `${AppLanguages.pricePerMonthForRequest[this.props.appLanguageCode]}: $${eachFacility.price_per_month}`}
                </div>
                <div className="booking-request-box-each-line-data-sib">
                {this.props.flat[facilityChoice.facilityObjectMap] || !eachFacility.facility_deposit ? '' : `${AppLanguages.depositForRequest[this.props.appLanguageCode]}: ${eachFacility.facility_deposit} ${AppLanguages.monthForRequest[this.props.appLanguageCode]}${this.singularOrPlural()}`}
                </div>
              </div>
            </div>
            <div className="booking-request-box-option-button-box">
              {this.props.flat[facilityChoice.facilityObjectMap] || !eachFacility.optional ? '' :
                this.facilityButtonSwitch(eachFacility, facilityString)
              }
            </div>
          </div>
        );
      });
    }
  }

  renderFacilities() {
    return (
      <div>
        <div className="booking-request-box-title">{AppLanguages.facilities[this.props.appLanguageCode]}</div>
        {this.renderEachFacility()}
      </div>
    );
  }

  singularOrPlural(deposit) {
    return (deposit > 1) && (this.props.appLanguageCode == 'en') ? 's' : '';
  }

  renderInitialPayment() {
    if (this.props.flat) {
    const { flat } = this.props;
    const facilityPaymentObject = this.getFacilityPayments();

    const paymentItems = [
      { name: AppLanguages.firstMonthRent[this.props.appLanguageCode], data: flat.price_per_month, unit: '$', style: 'normal' },
      { name: `${AppLanguages.depositForRequest[this.props.appLanguageCode]} ${flat.deposit ? '(x' + parseInt(flat.deposit, 10) + ' ' + AppLanguages.monthForRequest[this.props.appLanguageCode] + this.singularOrPlural(flat.deposit) + ' ' + AppLanguages.rent[this.props.appLanguageCode] + ')' : ''}`, data: flat.deposit * flat.price_per_month, unit: '$', style: 'normal' },
      { name: AppLanguages.firstMonthFacility[this.props.appLanguageCode], data: facilityPaymentObject.fees, unit: '$', style: 'normal' },
      { name: AppLanguages.facilityDeposit[this.props.appLanguageCode], data: facilityPaymentObject.deposits, unit: '$', style: 'normal' },
      { name: `${AppLanguages.keyMoney[this.props.appLanguageCode]} ${flat.key_money ? '(x' + parseInt(flat.key_money, 10) + ' ' + AppLanguages.monthForRequest[this.props.appLanguageCode] + this.singularOrPlural(flat.key_money) + ' ' + AppLanguages.rent[this.props.appLanguageCode] + ')' : ''}`, data: flat.key_money * flat.price_per_month, unit: '$', style: 'normal' },
      { name: AppLanguages.others[this.props.appLanguageCode], data: 0, unit: '$', style: 'normal' },
      // { name: 'Due at contract signing', data: (parseInt((flat.deposit * flat.price_per_month), 10) + parseInt(flat.price_per_month, 10)), unit: '$', style: 'bold' },
      { name: AppLanguages.initialPayment[this.props.appLanguageCode], data: null, unit: '$', style: 'bold' },
    ];

      return _.map(paymentItems, (eachItem, i) => {
        // if (eachItem.data) {
          return (
            <div key={i} className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title" style={{ fontWeight: eachItem.style }}>
                {eachItem.name}
              </div>
              <div className="booking-request-box-each-line-data" style={i == paymentItems.length - 1 ? { borderTop: '1px solid black' } : {}}>
                {i == paymentItems.length - 1 ? `${eachItem.unit}${this.sumPaymentTotal(paymentItems)}` : `${eachItem.unit}${parseInt(eachItem.data, 10)}`}
              </div>
            </div>
          );
        // }
      });
    }
  }

  getFacilityPayments() {
    let facilityTotalFees = 0;
    let facilityTotalDeposits = 0;
    _.each(this.state.addedFacilityArray, eachFacility => {
      console.log('in booking request, getFacilityPayments, eachFacility: ', eachFacility);
      if (!eachFacility.facility_included) {
        // check if any values null with ternary
        facilityTotalFees += eachFacility.price_per_month ? parseInt(eachFacility.price_per_month, 10) : 0;
        facilityTotalDeposits += eachFacility.facility_deposit && eachFacility.price_per_month ? (parseInt(eachFacility.facility_deposit, 10) * parseInt(eachFacility.price_per_month, 10)) : 0;
      }
    })
    const object = { fees: facilityTotalFees, deposits: facilityTotalDeposits };
    console.log('in booking request, getFacilityPayments, object: ', object);

    return object;
  }

  sumPaymentTotal(paymentItems) {
    let count = 0;
    _.each(paymentItems, (eachItem, i) => {
      if (i < paymentItems.length - 2) {
        count += parseInt(eachItem.data, 10);
      }
    });
    return count;
  }

  renderMonthlyPayments() {
    if (this.props.flat) {
      const { flat } = this.props;
      const facilityPaymentObject = this.getFacilityPayments();
      const paymentItems = [
        { name: AppLanguages.monthlyRent[this.props.appLanguageCode], data: flat.price_per_month, unit: '$', style: 'normal' },
        { name: AppLanguages.facilityFees[this.props.appLanguageCode], data: facilityPaymentObject.fees, unit: '$', style: 'normal' },
        { name: AppLanguages.managementFees[this.props.appLanguageCode], data: flat.management_fees, unit: '$', style: 'normal' },
        { name: AppLanguages.others[this.props.appLanguageCode], data: 0, unit: '$', style: 'normal' },
        { name: AppLanguages.totalMonthlyPayments[this.props.appLanguageCode], data: null, unit: '$', style: 'bold' },
      ];

      return _.map(paymentItems, (eachItem, i) => {
        // console.log('in booking request, renderMonthlyPayments, paymentItems.length, i, paymentItems.length == i: ', paymentItems.length, i, paymentItems.length == i);
        // if (eachItem.data) {
          return (
            <div key={i} className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title" style={{ fontWeight: eachItem.style }}>
                {eachItem.name}
              </div>
              <div className="booking-request-box-each-line-data" style={i == paymentItems.length - 1 ? { borderTop: '1px solid black' } : {}}>
                {i == paymentItems.length - 1 ? `${eachItem.unit}${this.sumPaymentTotal(paymentItems)}` : `${eachItem.unit}${parseInt(eachItem.data, 10)}`}
              </div>
            </div>
          );
        // }
      });
    }
  }

  renderBookingPaymentDetails() {
    return (
      <div>
        <div className="booking-request-box-title">{AppLanguages.paymentDetails[this.props.appLanguageCode]}</div>
        {this.renderInitialPayment()}
        <br/>
        {this.renderMonthlyPayments()}
      </div>
    );
  }

  checkIfOtherAlreadyInArray(array, eachTenantKey) {
    console.log('in booking_request, checkIfOtherAlreadyInArray, array, eachTenantKey, Tenants: ', array, eachTenantKey, Tenants);
    let index = null;
    _.each(array, (eachArrayObject, i) => {
      // const objectKeys = Object.keys(eachArrayObject);
      // const firstKey = objectKeys[0];
      // console.log('in booking_request, checkIfOtherAlreadyInArray, firstKey: ', firstKey);
      // console.log('in booking_request, checkIfOtherAlreadyInArray, Tenants[firstKey]: ', Tenants[firstKey]);
      // console.log('in booking_request, checkIfOtherAlreadyInArray, Object.keys(eachArrayObject): ', Object.keys(eachArrayObject));
      // console.log('in booking_request, checkIfOtherAlreadyInArray, Tenants[eachTenantKey]: ', Tenants[eachTenantKey]);
      if (Tenants[eachTenantKey].group == eachArrayObject.group) {
        index = i;
      }
    });
    console.log('in booking_request, checkIfOtherAlreadyInArray, index: ', index);
    return index;
  }

  handleFormSubmit(data) {
    console.log('in booking_request, handleFormSubmit, data: ', data);
    const tenantsArray = [];

    // get the delta of data from initialvalues
    const delta = {};
    _.each(Object.keys(data), each => {
      // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
      if (data[each] !== this.props.initialValues[each]) {
        delta[each] = data[each];
      }
    });
    // separate delta into profile and other tenants
    const dataToBeSent = { profile: {}, tenants: {}, facilities: [], booking: {} };

    _.each(Object.keys(delta), eachDeltaKey => {
      // if delta key in Profile.js
      if (eachDeltaKey in Profile) {
        dataToBeSent.profile[eachDeltaKey] = delta[eachDeltaKey];
      }
      // if delta key in tenants.js
      if (eachDeltaKey in Tenants) {
        // go through each tenant.js element to match key
        _.each(Object.keys(Tenants), (eachTenantKey) => {
          let object = {}
          // let count = 0;
          // if each user input change matches key in tenant.js
          if (eachDeltaKey == eachTenantKey) {
            // if tenant array has something in it
            if (tenantsArray.length > 0) {
              // check the index of the group
              const otherKeyInArrayIndex = this.checkIfOtherAlreadyInArray(tenantsArray, eachTenantKey);
              // if not null
              if (otherKeyInArrayIndex !== null) {
                tenantsArray[otherKeyInArrayIndex][Tenants[eachTenantKey].tenantObjectMap] = delta[eachTenantKey];
              } else {
                console.log('in booking_request, handleFormSubmit, else not null eachTenantKey: ', eachTenantKey);
                object = { [Tenants[eachTenantKey].tenantObjectMap]: delta[eachTenantKey], group: Tenants[eachTenantKey].group }
                tenantsArray.push(object);
              }
            } else {
              console.log('in booking_request, handleFormSubmit, if lenght > 0 null eachTenantKey: ', eachTenantKey);
              object = { [Tenants[eachTenantKey].tenantObjectMap]: delta[eachTenantKey], group: Tenants[eachTenantKey].group }
              tenantsArray.push(object);
            }
          }
        });
        dataToBeSent.tenants = tenantsArray;
      }
      //
    });

    if (this.state.addedFacilityArray.length > 0) {
      dataToBeSent.facilities = this.state.addedFacilityArray;
    }

    dataToBeSent.booking = this.props.bookingRequest;
    console.log('in booking_request, handleFormSubmit, delta, dataToBeSent: ', delta, dataToBeSent);
    this.props.requestBooking(dataToBeSent, (id) => {
      this.handleFormSubmitCallback(id);
    });
  }

  handleFormSubmitCallback(bookingId) {
    console.log('in booking_request, handleFormSubmitCallback: ', bookingId);
    // showHideClassName = 'modal display-none';
    this.props.history.push(`/BookingConfirmation/${bookingId}`);
  }

  renderEachInputField(eachBoxObject) {
    const profileKeyArray = ['first_name', 'last_name', 'birthday', 'address1', 'city', 'state', 'zip', 'country', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_address', 'co_tenant_name', 'co_tenant_age']
    // console.log('in booking_request, renderEachInputField　eachBoxObject.constantFile, Object.keys(): ', eachBoxObject.constantFile, Object.keys(eachBoxObject.constantFile));
    return _.map(Object.keys(eachBoxObject.constantFile), (eachKey, i) => {
      if (eachBoxObject.constantFile[eachKey].category && eachBoxObject.constantFile[eachKey].category == eachBoxObject.category) {
        // console.log('in booking_request, renderEachInputField, eachKey, eachBoxObject.constantFile[eachKey]: ', eachKey, eachBoxObject.constantFile[eachKey].name);
        // const key = eachBoxObject.constantFile[eachKey].name;
        return (
          <fieldset key={i} className="form-group form-group-personal">
            <label className="create-flat-form-label">{eachBoxObject.constantFile[eachKey][this.props.appLanguageCode]}:</label>
            <Field name={eachKey} component={InputField} type={eachBoxObject.constantFile[eachKey].type} className={eachBoxObject.constantFile[eachKey].className} />
          </fieldset>
        );
      }
    });
  }

  renderEachPersonalBox() {
    const personalArray = [
      { title: AppLanguages.basicInfoForTenant[this.props.appLanguageCode], category: 'basic', constantFile: Profile },
      { title: AppLanguages.inCaseOfEmergency[this.props.appLanguageCode], category: 'emergency', constantFile: Profile },
      { title: AppLanguages.otherTenants[this.props.appLanguageCode], category: 'tenants', constantFile: Tenants }
    ];
    // const personalArray = [{ title: 'Personal Info', category: 'basic', constant: 'Profile' }, { title: 'In Case of Emergency', category: 'emergency', constant: 'Profile' }, { title: 'Your Dependents', category: 'dependent', constant: 'Dependent' }]
    return _.map(personalArray, (eachObject, i) => {
      return (
        <div key={i} className="booking-request-personal-box-each">
          <div className="booking-request-box-title">{eachObject.title}</div>
          {this.renderEachInputField(eachObject)}
        </div>
      );
    });
  }

  renderUpdatePersonalDetails() {
    const { handleSubmit } = this.props;
    // <fieldset className="form-group form-group-personal">
    // <label className="create-flat-form-label">Title:</label>
    // <Field name={'title'} component={InputField} type="string" className="form-control" />
    // </fieldset>
    // <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

    return (
      <div>
        <h4>Personal Details</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div className="booking-request-personal-container container">
              <div className="booking-request-personal-row row">
                {this.renderEachPersonalBox()}
              </div>
            </div>
            {this.renderAlert()}
            <div className="confirm-change-and-button">
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.confirmReservationRequest[this.props.appLanguageCode]}</button>
            </div>
          </form>
      </div>
    );
  }

  renderBookingRequest() {
    return (
      <div className="container booking-request-container">
        <h3>{AppLanguages.bookingRequest[this.props.appLanguageCode]}</h3>
        <div className="row booking-request-row">
          <div className="booking-request-each-box">{this.renderBookingInfo()}</div>
          <div className="booking-request-each-box">{this.renderBookingPaymentDetails()}</div>
          <div className="booking-request-each-box">{this.renderFacilities()}</div>
          <div className="booking-request-each-box-personal">{this.renderUpdatePersonalDetails()}</div>
        </div>
      </div>
    );
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
        {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderBookingRequest()}
      </div>
    );
  }
}

const InputField = ({
  input,
  type,
  placeholder,
  meta: { touched, error, warning },
  }) => (
      <div>
          <input {...input} type={type} placeholder={placeholder} style={touched && error ? { borderColor: 'blue', borderWidth: '2px' } : {}} className="form-control" />
          {touched && error &&
            <div className="error">
              <span style={{ color: 'red' }}>* </span>{error}
            </div>
          }
      </div>
    );

function validate(values) {
  const { appLanguageCode } = values;

  // console.log('in booking request, validate values: ', values);
  // console.log('in booking request, validate values.appLanguageCode, values.appLanguages: ', values.appLanguageCode, values.appLanguages);
    const errors = {};
    if (appLanguageCode && AppLanguages) {
      if (!values.first_name) {
        errors.first_name = AppLanguages.firstNameError[appLanguageCode];
      }
      if (!values.last_name) {
        errors.last_name = AppLanguages.lastNameError[appLanguageCode];
      }
      if (!values.birthday) {
        errors.birthday = AppLanguages.birthdayError[appLanguageCode];
      }

      if (!values.address1) {
        errors.address1 = AppLanguages.address1Error[appLanguageCode];
      }

      if (!values.city) {
        errors.city = AppLanguages.cityError[appLanguageCode];
      }

      if (!values.state) {
        errors.state = AppLanguages.stateError[appLanguageCode];
      }

      if (!values.zip) {
        errors.zip = AppLanguages.zipError[appLanguageCode];
      }

      if (!values.country) {
        errors.country = AppLanguages.countryError[appLanguageCode];
      }
      if (!values.emergency_contact_name) {
        errors.emergency_contact_name = AppLanguages.emergencyNameError[appLanguageCode];
      }
      if (!values.emergency_contact_phone) {
        errors.emergency_contact_phone = AppLanguages.emergencyPhoneError[appLanguageCode];
      }

      if (!values.emergency_contact_address) {
        errors.emergency_contact_address = AppLanguages.emergencyAddressError[appLanguageCode];
      }

      if (!values.emergency_contact_relationship) {
        errors.emergency_contact_relationship = AppLanguages.emergencyRelationshipError[appLanguageCode];
      }
    }
    // console.log('in signin modal, validate errors: ', errors);
    return errors;
}

BookingRequest = reduxForm({
  form: 'BookingRequest',
  validate
})(BookingRequest);

function mapStateToProps(state) {
  // check if state has userProfile. Otherwise return empty object in mapStateToProps
  if (state.auth.userProfile) {
    // Populate initialValues with existing userProfile data
    const initialValues = state.auth.userProfile;
    // add appLanguageCode to initialvalues to add to state.form.BookingRequest.values
    // which gets passed to function validate
    initialValues.appLanguageCode = state.languages.appLanguageCode;

    console.log('in booking request, mapStateToProps, state: ', state);
    return {
      errorMessage: state.auth.error,
      bookingData: state.bookingData.fetchBookingData,
      bookingRequest: state.bookingData.bookingRequestData,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      userProfile: state.auth.userProfile,
      appLanguageCode: state.languages.appLanguageCode,
      // review: state.reviews.reviewForBookingByUser,
      // showEditReviewModal: state.modals.showEditReview
      // flat: state.flat.selectedFlat
      initialValues
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(BookingRequest);
