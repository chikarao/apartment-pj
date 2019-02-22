import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

// import Building from '../constants/building';
import Languages from '../constants/languages';
// import BankAccount from '../constants/bank_account';

// custom field component based on redux forms used for creating
// input and button inputs for forms
class FormChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      inputValue: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
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

  changeOtherFieldValues(fields, meta, val) {
    _.each(fields, eachFieldName => {
      meta.dispatch({
        type: '@@redux-form/CHANGE',
        payload: val,
        meta: { ...meta, field: eachFieldName },
      });
    });
  }

  renderEachChoice() {
    const { input: { value, onChange, name }, meta } = this.props;
    // Field has choices in each object (eg staff, contractor, facility etc); iterate through choices
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(this.props.model[name].choices, (choice, i) => {
      // console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record: ', this.props.record, this.props.model[name], this.props.record[this.props.model[name].map_to_record]);
      // console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record: ', this.props.record, this.props.model[name], this.props.model[name].map_to_record);
      // define button element for user to click to set value in submission
      const buttonElement =
        <div
          key={choice.value}
          type={choice.type}
          onClick={() => {
            onChange(choice.value);
            this.emptyInput();
            // if (choice.dependentKeys) {
            //   this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.dependentKeys.value)
            // }
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
      const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
      const inputElement =
        <input
          id="valueInput"
          value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          key={i}
          // key={choice.value}
          onChange={this.handleInputChange}
          type={choice.type}
          className={choice.className}
          style={{ borderColor: 'lightgray' }}
          placeholder={choice[this.props.appLanguageCode] ? choice[this.props.appLanguageCode] : ''}
        />
      // if choice type is string, use input element above and button if not string
      // choice.type can be string (input) or button element
      // if there is record and language_code in object; ie do not allow imput
      // make sure to read the respective objects in src/components/constants such as staff or contractor
      // !!!! logic for rendering languge_code buttons
      if (this.props.insertFieldObject) {
        console.log('FormChoices, renderEachChoice, this.props.insertFieldObject: ', this.props.insertFieldObject);
        console.log('FormChoices, renderEachChoice, this.props.formValues: ', this.props.formValues);
        const contingentRenderColumn = this.props.model[name].contingent_render;
        // formValues is a ReduxForm prop and insertFieldObject is passed in props in Field
        const { formValues, insertFieldObject } = this.props;
        let languageCodeArray = [];
        if (contingentRenderColumn) {
          // if the field has contingent_render, ie buttons/input render depends on whether
          // value has been assigned to column
          // find out if contingent render value has value
          if (formValues) {
            // form value exists in state/prop
            if (insertFieldObject[formValues[contingentRenderColumn]]) {
              languageCodeArray = insertFieldObject[formValues[contingentRenderColumn]].map(insertField => insertField.language_code)
              // get array of language codes for each insert field in obect
              if (!languageCodeArray.includes(choice.value)) {
                // if has value find out what languages are in the field
                return choice.type == 'string' ? inputElement : buttonElement;
              }
            } else {
              // if there is no key in insertFieldObject for the contingent
              return choice.type == 'string' ? inputElement : buttonElement;
            }
          } // end of if formValues
          // render only languages that do not have language for field
        } // end of if contingentRenderColumn

        if (!contingentRenderColumn) { // ie not language_code which depends on name
        //   const limitChoicesColumn = this.props.model[name].limit_choices
        const limitChoicesColumn = this.props.model[name].limit_choices;

          if (limitChoicesColumn) {
            const implementedLanguages = Object.keys(Languages).filter(key => Languages[key].implemented)
            // _.each(this.props.model[name].choices, eachChoice => {
              if (insertFieldObject[choice.value]) {
                // test only if insertFieldObject has each model choice;
                languageCodeArray = insertFieldObject[choice.value].map(insertField => insertField.language_code)
                // languageCodeArray = insertFieldObject[eachChoice.value]
                // console.log('FormChoices, renderEachChoice, implementedLanguages, languageCodeArray: ', implementedLanguages, languageCodeArray);
                let count = 0;
                _.each(implementedLanguages, eachImplementedLanguage => {
                  if (!languageCodeArray.includes(eachImplementedLanguage)) {
                    count++;
                    // console.log('FormChoices, renderEachChoice, eachImplementedLanguage, choice: ', eachImplementedLanguage, choice);
                    // return choice.type == 'string' ? inputElement : buttonElement;
                  }
                }); // end of each languageCodeArray
                const returnValue = choice.type == 'string' ? inputElement : buttonElement
                return (count > 0) ? returnValue : '';
              } else {
                return choice.type == 'string' ? inputElement : buttonElement;
              }
              // end of if insertFieldObject[eachChoice.value]
            // }) // end of each model choice
            // _.each(implementedLanguages, eachImplementedLanguage => {
            //
            // })
          } // end of if limitChoicesColumn
        } // end of if !contingentRenderColumn
        //
      } else { // !!!!!!! ELSE for if this.props.insertFieldObject
        if (this.props.record && this.props.model[name].map_to_record) {
          // console.log('FormChoices, renderEachChoice, this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create: ', this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create);
          // if the language code or map_to_record  does not equal the choice value
          // ie the choice is something other than the language code that already exists in the db
          if (choice.value !== this.props.record[this.props.model[name].map_to_record]) {
            // if the input form is a create form
            if (this.props.create) {
              // if an array with existing contractor language is true
              if (this.props.existingLanguageArray) {
                // if choice language is not included in the array, render the choice else return
                if (!this.props.existingLanguageArray.includes(choice.value)) {
                  return choice.type == 'string' ? inputElement : buttonElement;
                } else {
                  return;
                }
              } else {
                // render an input button or input field
                return choice.type == 'string' ? inputElement : buttonElement;
              }
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
              return <div key={choice.name}>{choice[this.props.appLanguageCode]}</div>
            }
          }
        } else {
          // if there is no record (db record) or model map to, ie a regular field
          return choice.type == 'string' ? inputElement : buttonElement;
        }
      } // END of if insertFieldObject
      // For document insert field create
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
  console.log('in form_choices, mapStateToProps, state.form.InsertFieldCreateModal: ', state.form.InsertFieldCreateModal);
  const formValues = state.form.InsertFieldCreateModal ? state.form.InsertFieldCreateModal.values : '';
  return {
    appLanguageCode: state.languages.appLanguageCode,
    addLanguageInput: state.modals.addLanguage,
    formValues
  };
}

// export default FormChoices;
export default connect(mapStateToProps, actions)(FormChoices);
