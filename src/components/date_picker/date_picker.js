import React, { Component } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker, { DateUtils } from 'react-day-picker';

import * as actions from '../../actions';

const INITIAL_STATE = {
    from: null,
    to: null,
    enteredTo: null, // Keep track of the last day for mouseEnter
};

class DatePicker extends Component {
  constructor(props) {
   super(props);
   this.handleDayClick = this.handleDayClick.bind(this);
   this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
   this.handleResetClick = this.handleResetClick.bind(this);
   // this.state = this.getInitialState();
   this.state = INITIAL_STATE;
 }

 isSelectingFirstDay(from, to, day) {
   const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
   const isRangeSelected = from && to;
   return !from || isBeforeFirstDay || isRangeSelected;
 }

 handleDayClick(day) {
   const { from, to } = this.state;
   if (from && to && day >= from && day <= to) {
     this.handleResetClick();
     return;
   }
   if (this.isSelectingFirstDay(from, to, day)) {
     this.setState({
       from: day,
       to: null,
       enteredTo: null,
     });
     console.log('in date_picker, handleDayClick, second if', this.state);
   } else {
     console.log('in date_picker, handleDayClick, if statement else first', day);
     this.setState({
       to: day,
       enteredTo: day
     });
     console.log('in date_picker, handleDayClick, if statement else', this.state);
     // added by co to call action creator and update application state in booking reducer
   }
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

 handleDayMouseEnter(day) {
   const { from, to } = this.state;
   if (!this.isSelectingFirstDay(from, to, day)) {
     this.setState({
       enteredTo: day,
     });
   }
 }
 handleResetClick() {
   this.setState(INITIAL_STATE);
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
   // console.log('in date_picker, render, from:', from);
   // console.log('in date_picker, render, to:', to);
   // this.handleDateSelect(from, to);
   const modifiers = { start: from, end: enteredTo };
   const disabledDays = { before: this.state.from };
   const selectedDays = [from, { from, to: enteredTo }];
   return (
     <div>
       <DayPicker
         className="Range"
         numberOfMonths={2}
         fromMonth={from}
         selectedDays={selectedDays}
         disabledDays={this.props.daysToDisable}
         // disabledDays={[{ after: new Date(2018, 4, 10), before: new Date(2018, 4, 18), }]}
         modifiers={modifiers}
         onDayClick={this.handleDayClick}
         onDayMouseEnter={this.handleDayMouseEnter}
       />
       <div>
         {!from && !to && 'Please select the first day.'}
         {from && !to && 'Please select the last day.'}
         {from && to &&
           `Selected from ${from.toLocaleDateString()} to
               ${to.toLocaleDateString()}`}{' '}
         {from &&
           to && (
             <button className="link" onClick={this.handleResetClick}>
               Reset
             </button>
           )}
       </div>

       <Helmet>

       <style>{`
         .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
           background-color: #f0f8ff !important;
           color: #4a90e2;
         }
         .Range .DayPicker-Day {
           border-radius: 0 !important;
         }
      `}</style>

       </Helmet>
     </div>
   );
 }
}

function handleClickCallAction(callback) {
  callback();
}

export default connect(null, actions)(DatePicker);
