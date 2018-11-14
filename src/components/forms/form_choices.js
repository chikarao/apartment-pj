import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Building from '../constants/building';
// import BankAccount from '../constants/bank_account';

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
  anyOfOtherValues(name, value) {
    const anyOtherValueArray = [];
    _.each(this.props.model[name].choices, choice => {
      if (choice.value == value) {
        // console.log('FormChoices, anyOfOtherValues choice.val, value', choice.val, value);
        anyOtherValueArray.push(choice)
      }
    });
    // return true if any other values in choices match, so value does not show in input field
    return anyOtherValueArray.length > 0;
  }

  renderEachChoice() {
    const { input: { value, onChange, name } } = this.props;
    // Field has choices in each object (eg staff, contractor, facility etc); iterate through choices
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(this.props.model[name].choices, (choice, i) => {
      // console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record: ', this.props.record, this.props.model[name], this.props.record[this.props.model[name].map_to_record]);
      // console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record: ', this.props.record, this.props.model[name], this.props.model[name].map_to_record);
      // define button element for user to click to set value in submission
      const buttonElement =
        <div
          key={i}
          type={choice.type}
          onClick={() => {
            onChange(choice.value);
            this.emptyInput();
          }}
          className={choice.className}
          style={value.toString() == choice.value && (value != null) ? { borderColor: 'black' } : { borderColor: 'lightgray' }}
        >
        {choice[this.props.appLanguageCode]}
        </div>
      // define input element for user to input
      // value is value passed from Field and needs to be specified for initialValues
      // this.anyOfOtherValues checks if any of the other choice.val matches value,
      // if so do not use as value, use ''
      const inputElement = <input id="valueInput" value={this.anyOfOtherValues(name, value) ? '' : value} key={choice.value} onChange={this.handleInputChange.bind(this)} type={choice.type} className={choice.className} style={{ borderColor: 'lightgray' }} placeholder={choice[this.props.appLanguageCode] ? choice[this.props.appLanguageCode] : ''} />
      // if choice type is string, use input element above and button if not string
      // const anotherValue = value;
      // console.log('FormChoices, renderEachChoice choice, choice.value, value, choice[value]: ', choice, choice.value, value, choice[anotherValue]);
      // choice.type can be string (input) or button element
      // if (this.props.addLanguageInput) {
      // if (this.props.model[name].limit_choices && this.props.record[this.props.model[name].map_to_record] != value) {
      console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create: ', this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create);
      // if there is record and language_code in object; ie do not allow imput
      // make sure to read the respective objects in constant such as staff or contractor
      if (this.props.record && this.props.model[name].map_to_record) {
        // if the language code or map_to_record  does not equal the choice value
        // ie the choice is something other than the language code that already exists in the db
        if (choice.value != this.props.record[this.props.model[name].map_to_record]) {
          // if the input form is a create form
          if (this.props.create) {
            // render an input button or input field
            return choice.type == 'string' ? inputElement : buttonElement;
            // return <div>{choice[this.props.appLanguageCode]}</div>
          } else {
            // if not on create form, do nothing
            return;
          }
          // return choice.type == 'string' ? inputElement : buttonElement;
        // if the choice value already exists
        } else {
            if (this.props.create) {
              // do nothing render nothing in create form
              return;
            } else {
              // just render choice en or jp, not an input button or field
              return <div key={i}>{choice[this.props.appLanguageCode]}</div>
            }
        }
      } else {
        // if there is no record (db record) or model map to, ie a regular field
        return choice.type == 'string' ? inputElement : buttonElement;
      }
    });
  }
  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { value, onChange, name } } = this.props;
      return (
      <div className="container form-control-custom-container" key={name}>
        <div className="row form-control-custom">
          {this.renderEachChoice()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in form_choices, mapStateToProps, state: ', state);
  return {
    appLanguageCode: state.languages.appLanguageCode,
    addLanguageInput: state.modals.addLanguage
  };
}

// export default FormChoices;
export default connect(mapStateToProps, actions)(FormChoices);
