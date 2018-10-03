import React, { Component } from 'react';
import _ from 'lodash';

import DocumentForm from '../constants/document_form';

class DocumentChoices extends Component {
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
      // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
      // sets value in this.props and for submission of form
      onChange(this.state.inputValue);
    });
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>

  anyOfOtherValues(name, value) {
    const anyOtherValueArray = [];
    _.each(DocumentForm[this.props.page][name].choices, choice => {
      if (choice.params.val == value) {
        console.log('DocumentChoices, anyOfOtherValues choice.params.val, value', choice.params.val, value);
        anyOtherValueArray.push(choice)
      }
    });
    // return true if any other values in choices match, so value does not show in input field
    return anyOtherValueArray.length > 0;
  }
  renderEachChoice() {
    const { input: { value, onChange, name } } = this.props;
    // console.log('DocumentChoices, renderEachChoice this.props.page', this.props.page)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(DocumentForm[this.props.page][name].choices, choice => {
      // console.log('DocumentChoices, renderEachChoice choice', choice.params.val);
      // console.log('DocumentChoices, renderEachChoice name', name);
      // console.log('DocumentChoices, renderEachChoice value', value);
      // define button element for user to click to set value in submission
      const buttonElement =
      <div
        key={choice.params.val}
        type={choice.params.type}
        onClick={() => {
          onChange(choice.params.val);
          this.emptyInput();
        }}
        className={choice.params.className}
        style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}
      />
      // define input element for user to input
      // value is value passed from Field and needs to be specified for initialValues
      // const inputElement = <input id="valueInput" value={value} key={choice.params.val} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
      console.log('DocumentChoices, renderEachChoice choice.params.val, value, this.anyOfOtherValues(name, value)', choice.params.val, value, this.anyOfOtherValues(name, value));
      // this.anyOfOtherValues checks if any of the other choice.params.val matches value,
      // if so do not use as value, use ''
      const inputElement = <input id="valueInput" value={this.anyOfOtherValues(name, value) ? '' : value} key={choice.params.val} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
      // const inputElement = <input id="valueInput" name={name} key={choice.params.val} value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
      // if choice type is string, use input element above and button if not string
      if (choice.params.type == 'string') {
        return inputElement;
      } else {
        return buttonElement;
      }
    })
  }
  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { value, onChange, name } } = this.props;
    // console.log('DocumentChoices, render this.props', this.props);
    // console.log('DocumentChoices, render value', value);
    // console.log('DocumentChoices, render name', name);
    // console.log('DocumentChoices, render onChange', onChange);
    // console.log('DocumentChoices, render value !== null', value !== null);
    // console.log('DocumentChoices, render value === ', value === '');
    // console.log('DocumentChoices, render value == undefined', value === undefined);
    // <div>The current value is {String(value)}.</div>

    // <div type={DocumentForm[name].box.type} onClick={() => onChange(val)} className={DocumentForm[name].box.className} style={value == val ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>Y</div>
    // <div key={name} style={DocumentForm[name].box.style}>
    return (
      <div key={name}>
         {this.renderEachChoice()}
        </div>
    );
  }
}

export default DocumentChoices;
