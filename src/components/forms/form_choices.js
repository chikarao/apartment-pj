import React, { Component } from 'react';
import _ from 'lodash';

import Building from '../constants/building';

class FormChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      inputValue: ''
    };
  }
  // Take user input in input element
  handleInputChange(event) {
    // destructure local props from Field element of Redux Forms
    // value is what is submitted in submit form data
    // onChange sets value of Field
    // name is the Field name that corresponds to DB column name
    const { input: { value, onChange, name } } = this.props;
    // sets state to give value to input field
    return this.setState({ inputValue: event.target.value }, () => {
      // console.log('FormChoices, handleInputChange this.state.inputValue', this.state.inputValue)
      // sets value in this.props and for submission of form
      onChange(this.state.inputValue);
    });
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      // console.log('FormChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>

  anyOfOtherValues(name, value) {
    const anyOtherValueArray = [];
    _.each(Building[name].choices, choice => {
      if (choice.val == value) {
        console.log('FormChoices, anyOfOtherValues choice.val, value', choice.val, value);
        anyOtherValueArray.push(choice)
      }
    });
    // return true if any other values in choices match, so value does not show in input field
    return anyOtherValueArray.length > 0;
  }

  renderEachChoice() {
    const { input: { value, onChange, name } } = this.props;
    // console.log('FormChoices, renderEachChoice this.props.page', this.props.page)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    // console.log('FormChoices, renderEachChoice name', name);
    return _.map(Building[name].choices, choice => {
      console.log('FormChoices, renderEachChoice choice, value', choice, value);
      // console.log('FormChoices, renderEachChoice value != null', value != null);
      // console.log('FormChoices, renderEachChoice value', value);
      // console.log('FormChoices, renderEachChoice name', name);
      // console.log('FormChoices, renderEachChoice value', value);
      // define button element for user to click to set value in submission
      const buttonElement =
        <div
          key={choice.val}
          type={choice.type}
          onClick={() => {
            onChange(choice.value);
            console.log('FormChoices, renderEachChoice inside onClick, choice.value, value', choice.value, value);
            this.emptyInput();
          }}
          className={choice.className}
          style={value.toString() == choice.value && (value != null) ? { borderColor: 'black' } : { borderColor: 'lightgray' }}
        >
        {choice.val}
        </div>
      // define input element for user to input
      // value is value passed from Field and needs to be specified for initialValues
      // const inputElement = <input id="valueInput" value={value} key={choice.val} onChange={this.handleInputChange.bind(this)} type={choice.type} className={choice.className} style={{ borderColor: 'lightgray', top: choice.top, left: choice.left, width: choice.width }} />
      // console.log('FormChoices, renderEachChoice choice.val, value, this.anyOfOtherValues(name, value)', choice.val, value, this.anyOfOtherValues(name, value));
      // this.anyOfOtherValues checks if any of the other choice.val matches value,
      // if so do not use as value, use ''
      const inputElement = <input id="valueInput" value={this.anyOfOtherValues(name, value) ? '' : value} key={choice.val} onChange={this.handleInputChange.bind(this)} type={choice.type} className={choice.className} style={{ borderColor: 'lightgray' }} />
      // const inputElement = <input id="valueInput" name={name} key={choice.val} value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} type={choice.type} className={choice.className} style={{ borderColor: 'lightgray', top: choice.top, left: choice.left, width: choice.width }} />
      // if choice type is string, use input element above and button if not string
      if (choice.type == 'string') {
        return inputElement;
      } else {
        return buttonElement;
      }
    })
  }
  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { value, onChange, name } } = this.props;
    // console.log('FormChoices, render this.props', this.props);
    // console.log('FormChoices, render value', value);
    // console.log('FormChoices, render name', name);
    // console.log('FormChoices, render onChange', onChange);
    // console.log('FormChoices, render value !== null', value !== null);
    // console.log('FormChoices, render value === ', value === '');
    // console.log('FormChoices, render value == undefined', value === undefined);
    // <div>The current value is {String(value)}.</div>

    // <div type={DocumentForm[name].box.type} onClick={() => onChange(val)} className={DocumentForm[name].box.className} style={value == val ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>Y</div>
    // <div key={name} style={DocumentForm[name].box.style}>
    return (
      <div className="form-control-custom" key={name}>
         {this.renderEachChoice()}
        </div>
    );
  }
}

export default FormChoices;
