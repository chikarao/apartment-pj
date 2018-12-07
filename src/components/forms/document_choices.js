import React, { Component } from 'react';
import _ from 'lodash';

// custom field component based on redux forms used for creating
// input and button inputs for forms
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
    // custom props eg charLimit does not destructure for some reason
    const { input: { value, onChange, name } } = this.props;
    // console.log('DocumentChoices, handleInputChange this.props', this.props);
    // sets state to give value to input field
    // check if input field has a character limit and
    // if so, update state and do onChange if less than limit
    // if (this.props.charLimit) {
    //   if (event.target.value.length <= this.props.charLimit) {
    //     return this.setState({ inputValue: event.target.value }, () => {
    //       // console.log('DocumentChoices, handleInputChange value, this.state.inputValue', value, this.state.inputValue);
    //       // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    //       // sets value in this.props and for submission of form
    //       onChange(this.state.inputValue);
    //     });
    //   }
    // } else {
      return this.setState({ inputValue: event.target.value }, () => {
        // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
        // sets value in this.props and for submission of form
        onChange(this.state.inputValue);
      });
    // }
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>
  // no longer used; keep for now until tested over some time.
  // anyOfOtherValues(name, value) {
  //   // function to check if value corresponds to other choice values
  //   // if so, leave input field blank since the input was made by a user button click
  //   const anyOtherValueArray = [];
  //   _.each(this.props.formFields[this.props.page][name].choices, choice => {
  //     if (choice.params.val == value) {
  //       // console.log('DocumentChoices, anyOfOtherValues choice.params.val, value', choice.params.val, value);
  //       anyOtherValueArray.push(choice)
  //     }
  //   });
  //   // return true if any other values in choices match, so value does not show in input field
  //   return anyOtherValueArray.length > 0;
  // }

  getStyleOfButtonElement(required, value, choice) {
    let elementStyle = {};

    // console.log('DocumentChoices, getStyleOfButtonElement, value.toString().toLowerCase(), choice.params.val.toString().toLowerCase() ', value.toString().toLowerCase(), choice.params.val.toString().toLowerCase());
    console.log('DocumentChoices, getStyleOfButtonElement, value, value.toString().toLowerCase() ', value, value.toString().toLowerCase());
    // console.log('DocumentChoices, getStyleOfButtonElement, false.toString().toLowerCase() ', false.toString().toLowerCase());
    // console.log('DocumentChoices, getStyleOfButtonElement, choice.params.val.toString().toLowerCase() ', choice.params.val.toString().toLowerCase());
    // console.log('DocumentChoices, getStyleOfButtonElement, required, value, choice.val ', required, value, choice.params.val);
    // if (value.toString().toLowerCase() == choice.params.val.toString().toLowerCase()) {
    if (value.toString().toLowerCase() === choice.params.val.toString().toLowerCase()) {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width };
    } else {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width };
    }

    if (this.props.nullRequiredField && !value) {
      // elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'blue', width: choice.params.width };
      elementStyle = { borderColor: 'blue', top: choice.params.top, left: choice.params.left, width: choice.params.width };
    }

    return elementStyle;
  }

  getStyleOfInputElement(value, choice) {
    let elementStyle = {};
    // console.log('DocumentChoices, getStyleOfInputElement ');
    if (this.props.nullRequiredField && !value) {
      // elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'blue', width: choice.params.width };
      elementStyle = { borderColor: 'blue', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.fontSize };
    } else {
      elementStyle = { borderColor: 'lightgray', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.fontSize };
    }

    return elementStyle;
  }

  renderEachChoice() {
    const { input: { value, onChange, name }, meta } = this.props;
    console.log('DocumentChoices, renderEachChoice name, value', name, value)
    // console.log('DocumentChoices, renderEachChoice this.props.otherChoiceValues', this.props.otherChoiceValues)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(this.props.formFields[this.props.page][name].choices, choice => {
        // console.log('DocumentChoices, renderEachChoice this.props.required', this.props.required);
      // console.log('DocumentChoices, renderEachChoice name, choice.params.val, value, choice.params.val == value', name, choice.params.val, value, choice.params.val == value);
      // define button element for user to click to set value in submission
      const buttonElement =
        <div
          key={choice.params.val}
          type={choice.params.type}
          onClick={() => {
            if (value == choice.params.val && this.props.formFields[this.props.page][name].second_click_off) {
              onChange('');
            } else {
              console.log('DocumentChoices, renderEachChoice name, value, choice.params.val', name, value, choice.params.val);
              // this.handleInputChange.bind(this)
              onChange(choice.params.val);
              this.emptyInput();
            }
          }}
          className={choice.params.className}
          // style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}
          style={this.getStyleOfButtonElement(this.props.required, value, choice)}
        />
      // define input element for user to input
      // value is value passed from Field and needs to be specified for initialValues
      // const inputElement = <input id="valueInput" value={value} key={choice.params.val} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
      // console.log('DocumentChoices, renderEachChoice choice.params.val, value, this.anyOfOtherValues(name, value)', choice.params.val, value, this.anyOfOtherValues(name, value));
      // this.anyOfOtherValues checks if any of the other choice.params.val matches value,
      // if so do not use as value, use ''
      const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
      const inputElement =
        <input
          id="valueInput"
          maxLength={this.props.charLimit}
          // value={this.anyOfOtherValues(name, this.state.inputValue) ? '' : this.state.inputValue}
          // value={dirtyValue}
          // value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.params.val}
          onChange={this.handleInputChange.bind(this)}
          type={choice.params.type}
          className={choice.params.className}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />

      const textareaElement =
        <textarea
          id="valueTextarea"
          name={choice.params.name}
          maxLength={this.props.charLimit}
          // value={this.anyOfOtherValues(name, this.state.inputValue) ? '' : this.state.inputValue}
          // value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.params.val}
          onChange={this.handleInputChange.bind(this)}
          type={choice.params.type}
          className={choice.params.className}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />
      // const inputElement = <input id="valueInput" name={name} key={choice.params.val} value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} type={choice.params.type} className={choice.params.className} style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }} />
      // if choice type is string, use input element above and button if not string
      if (choice.params.type == 'string') {
        return inputElement;
      } else if (choice.params.type == 'text')  {
        return textareaElement;
      } else {
        return buttonElement;
      }
    })
  }
  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { name } } = this.props;
    // console.log('DocumentChoices, render this.props', this.props);
    // console.log('DocumentChoices, render value', value);
    // console.log('DocumentChoices, render name', name);
    // console.log('DocumentChoices, render onChange', onChange);
    // console.log('DocumentChoices, render value !== null', value !== null);
    // console.log('DocumentChoices, render value === ', value === '');
    // console.log('DocumentChoices, render value == undefined', value === undefined);
    // <div>The current value is {String(value)}.</div>

    // <div type={this.props.formFields[name].box.type} onClick={() => onChange(val)} className={this.props.formFields[name].box.className} style={value == val ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>Y</div>
    // <div key={name} style={this.props.formFields[name].box.style}>
    return (
      <div key={name}>
         {this.renderEachChoice()}
        </div>
    );
  }
}

export default DocumentChoices;
