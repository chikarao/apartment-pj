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
      console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
      // sets value in this.props and for submission of form
      onChange(this.state.inputValue);
    });
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>
  renderEachChoice() {
    const { input: { value, onChange, name } } = this.props;
    // Field has choices in document_form object; iterate through choices
    return _.map(DocumentForm[name].choices, choice => {
      // console.log('DocumentChoices, renderEachChoice choice', choice);
      // define button element for user to click to set value in submission
      const buttonElement = <div
        key={choice.params.val}
        type={choice.params.type}
        onClick={() => {
          onChange(choice.params.val);
          this.emptyInput();
        }}
        className={choice.params.className}
        style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}></div>
      // define input element for user to input
      const inputElement = <input id="valueInput" key={choice.params.val} value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
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
