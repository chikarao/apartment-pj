import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

// import Building from '../constants/building';
import Languages from '../constants/languages';
import globalConstants from '../constants/global_constants';
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

  getModelChoice(modelChoices, userChoiceInFormValues) {
    let objectReturned = {};
    _.each(modelChoices, eachChoice => {
      if (eachChoice.value == userChoiceInFormValues) {
        objectReturned = eachChoice;
        return;
      }
    });
    return objectReturned;
  }

  getDocumentFormParams(documentForm, userChoiceInFormValues) {
    // console.log('FormChoices, getDocumentFormParams, documentForm, userChoiceInFormValues: ', documentForm, userChoiceInFormValues);
    let objectReturned = {};
    _.each(documentForm, eachPage => {
      // console.log('FormChoices, getDocumentFormParams, each eachPage, userChoiceInFormValues: ', eachPage, userChoiceInFormValues);
      if (eachPage[userChoiceInFormValues]) {
        // console.log('FormChoices, getDocumentFormParams, if eachPage[userChoiceInFormValues], userChoiceInFormValues: ', eachPage[userChoiceInFormValues], userChoiceInFormValues);
        objectReturned = eachPage[userChoiceInFormValues].choices[0].params;
      }
    });
    return objectReturned;
  }

  getCustomValue(pageLocation) {
    // const { input: { onChange } } = this.props;

    // const clickedElement = event.target;
    // const elementVal = clickedElement.getAttribute('value');
    const agreementPages = this.props.agreement.document_pages;
    console.log('FormChoices, getCustomValue, pageLocation, agreementPages, this.props.agreement: ', pageLocation, agreementPages, this.props.agreement);
    if (pageLocation === 'insertAtEnd') return agreementPages;
    if (pageLocation === 'insertBeforeLastPage') return agreementPages - 1;
    if (pageLocation === 'insertBeforeFirst') return 0;
    return null;
    // switch (pageLocation) {
    //   case 'insertAtEnd':
    //   console.log('FormChoices, getCustomValue, in insertAtEnd pageLocation: ', pageLocation);
    //     // onChange(agreementPages);
    //     return agreementPages;
    //   case 'insertBeforeLastPage':
    //   console.log('FormChoices, getCustomValue, in insertBeforeLastPage pageLocation: ', pageLocation);
    //     return agreementPages - 1;
    //     // onChange(agreementPages);
    //   case 'insertBeforeFirst':
    //   console.log('FormChoices, getCustomValue, in insertBeforeFirst pageLocation: ', pageLocation);
    //     return 0;
    //
    //   default: return null;
    // }
  }

  renderEachChoice() {
    const { input: { value, onChange, name }, meta } = this.props;
    // Field has choices in each object (eg staff, contractor, facility etc); iterate through choices
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    let modelChoice = null;
    let widthPx = null;
    let heightPx = null;
    // let customValue = null;
    const { formValues, insertFieldObject } = this.props;

    return _.map(this.props.model[name].choices, (choice, i) => {
      console.log('FormChoices, renderEachChoice, choice: ', choice);
      // define button element for user to click to set value in submission
      // get modelChoice to get field config from constants/...js
      // Preset as null so that can test if true
      // if redux form has values prop; formValues coming from mapStateToProps
      if (formValues) {
        // if this is coming from create
       if (this.props.model[name].contingent_style) {
         const userChoiceInFormValues = formValues[this.props.model[name].contingent_style];
         modelChoice = this.getModelChoice(this.props.model[this.props.model[name].contingent_style].choices, userChoiceInFormValues)
         // get params from document form eg important_points_explanation to get input dimensions
         const documentFormParams = this.getDocumentFormParams(modelChoice.inForm, userChoiceInFormValues)
         // get dimensions of A4 paper in px for ex important_points_explanation
         const a4Width = globalConstants.a4Width;
         const a4Height = globalConstants.a4Height;
         // get the width and height in px
         widthPx = a4Width * (parseFloat(documentFormParams.width) / 100);
         heightPx = a4Height * (parseFloat(documentFormParams.height) / 100);
         // console.log('FormChoices, renderEachChoice, parseFloat a4Width, documentFormParams.width, widthPx, a4Height, parseFloat documentFormParams.height, heightPx: ', a4Width, parseFloat(documentFormParams.width), widthPx, a4Height, parseFloat(documentFormParams.height), heightPx);
       }
      }
      // If choice is given width assign to modelChoice; For documentInsertCreateModal
      if (choice.width) modelChoice = { width: choice.width }
      // For documentInsertCreateModal
      const customValue = choice.customOnchange ? this.getCustomValue(choice.value) : '';
      console.log('FormChoices, renderEachChoice, customValue, choice, customValue.toString(), value.toString(): ', customValue, choice, customValue.toString(), value.toString());

      const buttonElement =
        <div
          key={choice.value}
          type={choice.type}
          value={customValue}
          onClick={choice.customOnchange
            ?
            () => {
              console.log('FormChoices, renderEachChoice, before onChange, customValue, choice: ', customValue, choice);
              onChange(customValue);
              this.emptyInput();
            }
            :
            () => {
              onChange(choice.value);
              this.emptyInput();
            }
        }
          className={choice.className}
          style={(value.toString() == choice.value || (customValue !== '' && value.toString() === customValue.toString())) && (value != null) ? { borderColor: 'black' } : { borderColor: 'lightgray' }}
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
          onChange={this.handleInputChange}
          type={choice.type}
          className={choice.className}
          maxLength={modelChoice ? modelChoice.charLimit : ''}
          style={modelChoice ? { width: modelChoice.width, height: modelChoice.height, textAlign: 'left' } : { width: '400px', borderColor: 'lightgray', textAlign: 'left' }}
          placeholder={choice[this.props.appLanguageCode] ? choice[this.props.appLanguageCode] : ''}
        />

      const textareaElement =
        <textarea
          id="valueInput"
          value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          key={i}
          onChange={this.handleInputChange}
          type={choice.type}
          className={choice.className}
          maxLength={modelChoice ? modelChoice.charLimit : 400}
          style={widthPx && heightPx ? { width: `${widthPx}px`, height: `${heightPx}px`, textAlign: 'left' } : { width: '400px', borderColor: 'lightgray', textAlign: 'left' }}
          placeholder={choice[this.props.appLanguageCode] ? choice[this.props.appLanguageCode] : ''}
        />
      // if choice type is string, use input element above and button if not string
      // choice.type can be string (input) or button element
      // if there is record and language_code in object; ie do not allow input
      // make sure to read the respective objects in src/components/constants such as staff or contractor
      // !!!! logic for rendering languge_code buttons
      if (this.props.insertFieldObject) {
        // eg language_code field has contingent_render of name
        const contingentRenderColumn = this.props.model[name].contingent_render;
        // formValues is a ReduxForm prop and insertFieldObject is passed in props in Field
        let languageCodeArray = [];
        // contingent_render is a key in constants/ objects to get fields in modals that adjust in size
        // Based on the dimensions required on document inserts (not used in template world)
        if (contingentRenderColumn) {
          // if the field has contingent_render, ie buttons/input render depends on whether
          // value has been assigned to column
          // find out if contingent render value has value
          if (formValues) {
            // form value exists in state/prop
            // insertFieldObject is for rendering fields in documentInserts (not used in template world)
            if (insertFieldObject[formValues[contingentRenderColumn]]) {
              languageCodeArray = insertFieldObject[formValues[contingentRenderColumn]].map(insertField => insertField.language_code)
              // get array of language codes for each insert field in obect
              // if (!languageCodeArray.includes(choice.value)) {
              if (languageCodeArray.indexOf(choice.value) === -1) {
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

        if (!contingentRenderColumn) { // ie not language_code which depends on other fields eg name
          // limit choices is a boolean specified in constant/...
          const limitChoicesColumn = this.props.model[name].limit_choices;

          if (limitChoicesColumn) {
            // which languages have been marked implemented in the constants/languages
            const implementedLanguages = Object.keys(Languages).filter(key => Languages[key].implemented)
            // _.each(this.props.model[name].choices, eachChoice => {
            if (insertFieldObject[choice.value]) {
              // test only if insertFieldObject has each model choice;
              languageCodeArray = insertFieldObject[choice.value].map(insertField => insertField.language_code)
              let count = 0;
              _.each(implementedLanguages, eachImplementedLanguage => {
                if (languageCodeArray.indexOf(eachImplementedLanguage) === -1) {
                  count++;
                }
              }); // end of each languageCodeArray
              const returnValue = choice.type == 'string' ? inputElement : buttonElement
              return (count > 0) ? returnValue : '';
            } else { // if insertFieldObject does not contain choice.value
              return choice.type == 'string' ? inputElement : buttonElement;
            }
              // end of if insertFieldObject[eachChoice.value]
          } else { // if limitChoicesColumn
            // if neither limitChoicesColumn nor contingentRenderColumn there is insertFieldObject
            console.log('FormChoices, renderEachChoice, else in !contingentRenderColumn, not limitChoices choice: ', choice);
            if (choice.type == 'text') {
              // console.log('FormChoices, renderEachChoice, else no record or model map choice: ', choice);
              return textareaElement;
            } else {
              return choice.type == 'string' ? inputElement : buttonElement;
            }
          } // end of if limitChoicesColumn
        } // end of if !contingentRenderColumn
        //
      } else { // !!!!!!! ELSE for if this.props.insertFieldObject
        console.log('FormChoices, renderEachChoice, else ELSE for if this.props.insertFieldObject: ', choice);
        // !!!!!this else half is used in template
        if (this.props.record && this.props.model[name].map_to_record) {
          // console.log('FormChoices, renderEachChoice, if else insertFieldObject this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create: ', this.props.record, this.props.model[name], this.props.model[name].map_to_record, this.props.record[this.props.model[name].map_to_record], this.props.create);
          // if the language code or map_to_record  does not equal the choice value
          // ie the choice is something other than the language code that already exists in the db
          if (choice.value !== this.props.record[this.props.model[name].map_to_record]) {
            // if the input form is a create form
            if (this.props.create) {
              // if an array with existing contractor language is true
              if (this.props.existingLanguageArray) {
                // if choice language is not included in the array, render the choice else return
                // if (!this.props.existingLanguageArray.includes(choice.value)) {
                if (this.props.existingLanguageArray.indexOf(choice.value) === -1) {
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
            // if the choice value already exists
          } else {
            if (this.props.create) {
              // do nothing render nothing in create form
              return;
            } else {
              // just render choice en or jp, not an input button or field
              // return <div key={choice.name}>{choice[this.props.appLanguageCode]}</div>
              return <div key={i}>{choice[this.props.appLanguageCode]}</div>
            }
          }
        } else { // end of   if (this.props.record && this.props.model[name].map_to_record)
          // if there is no record (db record) or model map to, ie a regular field
          // return choice.type == 'string' ? inputElement : buttonElement;
          if (choice.type == 'text') {
            console.log('FormChoices, renderEachChoice, else no record or model map choice: ', choice);
            return textareaElement;
          } else {
            console.log('FormChoices, renderEachChoice, else no record or model map choice not text: ', choice);
            return choice.type == 'string' ? inputElement : buttonElement;
          }
        }
      } // END of if insertFieldObject
      // For document insert field create
    });
  }

  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { value, onChange, name }, contingentStyleClassName, contingentStyleClassNameChild } = this.props;
    // console.log('FormChoices, render,　name: ',　name);

      return (
      <div className={contingentStyleClassName || 'container form-control-custom-container'} key={name}>
        <div className={contingentStyleClassNameChild || 'row form-control-custom'}>
          {this.renderEachChoice()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in form_choices, mapStateToProps, state: ', state);
  // console.log('in form_choices, mapStateToProps, state.form.InsertFieldCreateModal: ', state.form.InsertFieldCreateModal);
  // identify which form in redux form state is acitve
  const activeForm = state.form.InsertFieldCreateModal || state.form.InsertFieldEditModal;
  const formValues = activeForm ? activeForm.values : '';
  return {
    appLanguageCode: state.languages.appLanguageCode,
    addLanguageInput: state.modals.addLanguage,
    formValues,
    documentKey: state.documents.createDocumentKey,
  };
}

// export default FormChoices;
export default connect(mapStateToProps, actions)(FormChoices);
