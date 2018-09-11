import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Helmet from 'react-helmet';
// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker, { DateUtils } from 'react-day-picker';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages'


const INITIAL_STATE = {
    from: null,
    to: null,
    enteredTo: null, // Keep track of the last day for mouseEnter
};

// let daysToDisableForBooking = {};
const daysToDisableForBookingArray = [];

class DatePicker extends Component {
  constructor(props) {
   super(props);
   this.handleDayClick = this.handleDayClick.bind(this);
   this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
   this.handleResetClick = this.handleResetClick.bind(this);
   // this.state = this.getInitialState();
   this.state = INITIAL_STATE;
 }

 // componentDidMount() {
 // }
 // check if selected date is a disabled date (including ical inpurts)
 // Using componentDidUpdate since ical imports do not get reflected until
 // ics file received and added to disabled days so check if disabled days in
 // prevProps has different number of ranges than this.props. if different,
 // push range in daysToDisableForBookingArray, used to check if day is disabled
 componentDidUpdate(prevProps) {
   // console.log('in date_picker, componentDidUpdate, each, this.props.daysToDisable.length !== prevProps.daysToDisable.length', this.props.daysToDisable.length !== prevProps.daysToDisable.length);
   if (this.props.daysToDisable.length !== prevProps.daysToDisable.length) {
     // console.log('in date_picker, componentDidUpdate, this.props.daysToDisable.length !== prevProps.daysToDisable.length', this.props.daysToDisable.length, prevProps.daysToDisable.length, this.props.daysToDisable.length !== prevProps.daysToDisable.length);
     // console.log('in date_picker, componentDidUpdate, this.props.daysToDisable, prevProps.daysToDisable', this.props.daysToDisable, prevProps.daysToDisable);
     const { daysToDisable } = this.props;
     _.each(daysToDisable, (range) => {
       // console.log('in date_picker, componentDidUpdate, each, range.after', range);
       // setDate and getTime seems to mutate daysToDisable, so make a new copied date and adjust it
       //https://stackoverflow.com/questions/1090815/how-to-clone-a-date-object-in-javascript
       const copiedDateToDisableForBooking = new Date(range.after);
       copiedDateToDisableForBooking.setDate(copiedDateToDisableForBooking.getDate() + 1);
       const adjustedDaysToDisable = { after: copiedDateToDisableForBooking, before: range.before };
       daysToDisableForBookingArray.push(adjustedDaysToDisable);
     });
     // adjustedAfterDate.setDate(adjustedAfterDate.getDate() - 1);
     console.log('in date_picker, componentDidUpdate, daysToDisableForBookingArray', daysToDisableForBookingArray);
   }
 }

 isSelectingFirstDay(from, to, day) {
   const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
   const isRangeSelected = from && to;

   // !!!!!!!!!!!!!!Change to original code!!!!!!!
   return !from || isBeforeFirstDay || isRangeSelected;
 }

 isDayDisabled(day) {
   let inRange = false;
   // const { daysToDisable } = this.props;
   // let inRange1 = false;
   // console.log('in date_picker, isSelectingFirstDay, from', from);
   // console.log('in date_picker, isSelectingFirstDay, to', to);
   console.log('in date_picker, isDayDisabled, day:', day);
   console.log('in date_picker, isDayDisabled, this.props.daysToDisable:', this.props.daysToDisable);
   console.log('in date_picker, isDayDisabled, daysToDisableForBookingArray:', daysToDisableForBookingArray);
   // console.log('in date_picker, isSelectingFirstDay, isBeforeFirstDay', isBeforeFirstDay);
   // console.log('in date_picker, isSelectingFirstDay, isRangeSelected', isRangeSelected);

  _.each(daysToDisableForBookingArray, (range) => {
     console.log('in date_picker, isDayDisabled, in each, range:', range);
     // const after = range.after;

     // const adjustedAfter = range.afterForBooking.setDate(after.getDate() + 1);
     console.log('in date_picker, isDayDisabled, in each, setDate then after:', range.after);
     if ((day > range.after) && (day < range.before)) {
     // if (day > range.after && day < range.before) {
       // if (day > range.after) {
       // console.log('in date_picker, isDayDisabled, in each, if, in disabled range:');
       // console.log('in date_picker, isDayDisabled, in each, if, in disabled range, day:', day);
       inRange = true;
       return;
       // console.log('in date_picker, isDayDisabled, in each, if, in disabled range, inRange:', inRange);
     }
     // else {
     //   // console.log('in date_picker, isDayDisabled, in each, if, not in disabled range:');
     //   // console.log('in date_picker, isDayDisabled, in each, if, not in disabled range, day:', day);
     //   // console.log('in date_picker, isDayDisabled, in each, if, not in disabled range, inRange:', inRange);
     // }
   });
   return inRange;
 }

 getDatesArray(startDate, endDate) {
   //reference
   // https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
   const datesArray = [];
   // datesArray.push(startDate);
   const numDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
   console.log('in date_picker, getDatesArray, numDays', numDays);

   const nextDate = startDate;
   console.log('in date_picker, getDatesArray, nextDate', nextDate);

   const nextDateCopied = new Date(nextDate);
   console.log('in date_picker, getDatesArray, nextDateCopied', nextDateCopied);
   //
   // datesArray.push(nextDateCopied);
   //https://gist.github.com/miguelmota/7905510
   const addDays = function (i, date) {
     console.log('calling function within getDatesArray for loop', i, date);
     const dateNew = new Date(date);
     dateNew.setDate(dateNew.getDate() + i);
     return dateNew;
    };

   for (let i = 0; i <= numDays; i++) {
     // datesArray.push(nextDateCopied);
     // console.log('in date_picker, getDatesArray, nextDateCopied', nextDateCopied);
     //
     // nextDateCopied.setDate(nextDateCopied.getDate() + i);
     // console.log('in date_picker, getDatesArray, datesArray:', datesArray);
     datesArray.push(addDays(i, nextDate));
   }

   console.log('in date_picker, getDatesArray, datesArray:', datesArray);
   return datesArray;
 }

 checkRangeDisabled(datesArray) {
   console.log('in date_picker, checkRangeDisabled, datesArray:', datesArray);
    let dayIsDisabled = false;
    let disabledCounter = 0;

   _.each(datesArray, (date) => {
     // console.log('in date_picker, checkRangeDisabled, in each, date:', date);
     dayIsDisabled = this.isDayDisabled(date);
     if (dayIsDisabled) {
       // console.log('in date_picker, checkRangeDisabled, in each, if isDayDisabled:', date, dayIsDisabled);
       console.log('in date_picker, checkRangeDisabled, in each, if isDayDisabled:', date, dayIsDisabled);
       disabledCounter++;
     }
     console.log('in date_picker, checkRangeDisabled, in each, if isDayDisabled:', date, dayIsDisabled);
   });
   console.log('in date_picker, checkRangeDisabled, after each, counter:', disabledCounter);
   if (disabledCounter > 0) {
     dayIsDisabled = true;
   }
   console.log('in date_picker, checkRangeDisabled, after each and checking counter, isDayDisabled:', dayIsDisabled);
   return dayIsDisabled;
 }

 handleDayClick(day) {
   console.log('in date_picker, handleDayClick, day: ', day);
   const { from, to } = this.state;
   const isDayDisabled = this.isDayDisabled(day);
   // console.log('in date_picker, handleDayClick, this.isDayDisabled:', this.isDayDisabled(day));
  if (isDayDisabled) {
    this.handleResetClick();
    // return;
  } else {
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      console.log('in date_picker, handleDayClick, first if', this.state);
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
      }, () => {
        // this.handleResetClick();
         this.props.selectedDates({ to: null, from: null });
      });
      console.log('in date_picker, handleDayClick, second if', this.state);
    } else {
      console.log('in date_picker, handleDayClick, if statement else first', day);
      const datesArray = this.getDatesArray(from, day);
      // const noDisabledDaysInBetween = this.getDates(from, day);
      console.log('in date_picker, handleDayClick, if statement else first, datesArray', datesArray);
      console.log('in date_picker, handleDayClick, if statement else first, this.checkRangeDisabled(datesArray)', this.checkRangeDisabled(datesArray));

      if (!this.checkRangeDisabled(datesArray)) {
        console.log('in date_picker, handleDayClick, if statement else first, if inside checkRangeDisabled false');
        this.setState({
          to: day,
          enteredTo: day
        });
        console.log('in date_picker, handleDayClick, if statement else', this.state);
        // added by co to call action creator and update application state in booking reducer
      } else {
        console.log('in date_picker, handleDayClick, if !checkRangeDisabled statement else, handleResetClick called.');
        this.handleResetClick();
      }
    }
    //end of else second if
    const dates = this.state;
    console.log('in date_picker, handleDayClick, dates.to', dates.to);
    console.log('in date_picker, handleDayClick, dates.to', dates.enteredTo);
    console.log('in date_picker, handleDayClick, dates.from', dates.from);
    console.log('in date_picker, handleDayClick, dates', dates);

    if (dates.from && dates.enteredTo) {
      const datesForAction = { from: dates.from, to: dates.enteredTo };
      console.log('in date_picker, handleClick, calling selectedDates(datesForAction)', datesForAction);
      return this.props.selectedDates(datesForAction);
    }
   }
   //end of else, first if
 } // end of handleDayClick

 handleDayMouseEnter(day) {
   const { from, to } = this.state;
   const isDayDisabled = this.isDayDisabled(day);
   console.log('in date_picker, handleDayMouseEnter, calling isDayDisabled:', isDayDisabled);

   if (!this.isSelectingFirstDay(from, to, day)) {
     this.setState({
       enteredTo: day
     });
   }
 }

 handleResetClick() {
   console.log('in date_picker, handleResetClick');
   this.setState(INITIAL_STATE, () => {
     this.props.selectedDates({ to: this.state.enteredTo, from: this.state.from })
   });
 }

//not using since updating state in render is not preferable
 // handleDateSelect(from, to) {
 //   if (from && to) {
 //     console.log('in date_picker, handleDateSelect, dates selected', from);
 //     console.log('in date_picker, handleDateSelect, dates selected', to);
 //     const dates = { from, to };
 //     // this.props.selectedDates(dates);
 //   }
 // }

 render() {
   const { from, to, enteredTo } = this.state;
   // console.log('in date_picker, render, from: ', from);
   // console.log('in date_picker, render, this.props.daysToDisable: ', this.props.daysToDisable);
   // console.log('in date_picker, render, from:', from);
   // console.log('in date_picker, render, to:', to);
   // this.handleDateSelect(from, to);
   const modifiers = { start: from, end: enteredTo };
   // const disabledDays = { before: this.state.from };
   const selectedDays = [from, { from, to: enteredTo }];
   return (
     <div>
       <h5>
       {!from && !to && AppLanguages.selectFirst[this.props.appLanguageCode]}
       {from && !to && AppLanguages.selectLast[this.props.appLanguageCode]}
       {from && to &&
         `${AppLanguages.selectFrom[this.props.appLanguageCode]} ${from.toLocaleDateString()} to
         ${to.toLocaleDateString()}`}{' '}
         {from &&
           to && (
             <button className="btn btn-primary btn-small date-picker-reset-btn" onClick={this.handleResetClick}>
             Reset
             </button>
           )}
        </h5>
       <DayPicker
         className="Range"
         numberOfMonths={3}
         // month={new Date(2015, 8)}
         fromMonth={from}
         selectedDays={selectedDays}
         disabledDays={this.props.daysToDisable}
         // disabledDays={[{ after: new Date(2018, 4, 10), before: new Date(2018, 4, 18), }]}
         modifiers={modifiers}
         onDayClick={this.handleDayClick}
         onDayMouseEnter={this.handleDayMouseEnter}
       />

       <Helmet>

       <style>{`
         .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
           background-color: #f0f8ff !important;
           color: #4a90e2;
         }
         .Range .DayPicker-Day {
           border-radius: 0 !important;
         }`}</style>

       </Helmet>
     </div>
   );
 }
}

function mapStateToProps(state) {
  console.log('in date_picker, mapStateToProps, state: ', state);
    return {
      appLanguageCode: state.languages.appLanguageCode

    };
  }

export default connect(mapStateToProps, actions)(DatePicker);
