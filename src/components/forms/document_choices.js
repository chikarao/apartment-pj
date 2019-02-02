import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Documents from '../constants/documents';

// custom field component based on redux forms used for creating
// input and button inputs for forms
class DocumentChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      inputValue: '',
      enclosedText: '',
      focusedInput: {},
      blurredInput: {},
      valueWhenInputFocused: '',
      // editHistoryArray: [],
    };

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  shouldComponentUpdate(nextProps) {
    // checks to find out if each field value has changed, and if not will not call componentDidUpdate
    // console.log('DocumentChoices, shouldComponentUpdate nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value', nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value);
    // console.log('DocumentChoices, shouldComponentUpdate, nextProps, this.props', nextProps, this.props);
    // if (nextProps.meta.initial != this.props.meta.initial) {
    //   this.props.editHistory({ action: 'dirtyFieldCount', count: 1 })
    // }
    // console.log('DocumentChoices, shouldComponentUpdate nextProps.input, this.props.input', nextProps.input.value, this.props.input.value);
    return nextProps.input.value != this.props.input.value;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('DocumentChoices, componentDidUpdate prevState.focusedInput', prevState.focusedInput);
  //   console.log('DocumentChoices, componentDidUpdate this.state.focusedInput', this.state.focusedInput);
  //   console.log('DocumentChoices, componentDidUpdate this.state.blurredInput', this.state.blurredInput);
  //   console.log('DocumentChoices, componentDidUpdate prevState.blurredInput', prevState.blurredInput);
  // }
  // Take user input in input element
  handleInputChange(event) {
    // destructure local props from Field element of Redux Forms
    // value is what is submitted in submit form data
    // onChange sets value of Field
    // name is the Field name that corresponds to DB column name
    // custom props eg charLimit does not destructure for some reason
    const { input: { value, onChange, name }, meta, input } = this.props;
    // console.log('DocumentChoices, handleInputChange event.target.value', event.target.value);
    // !!!!No need to use input element value props; update value directly with onChange in handleInputChange in RFv7.4.2
    onChange(event.target.value);
    console.log('DocumentChoices, handleInputChange input, meta, meta.dirty, value, event.target.value, this.props.dirtyFields', input,meta,  meta.dirty, value, event.target.value, this.props.dirtyFields);
    // check if name is false in dirtyFields in state; if so flip
    // if (this.props.dirtyFields[name] != meta.dirty) {
    //   this.props.editHistory({ editHistoryItem: null, action: 'flipDirtyField', name, dirty: meta.dirty })
    // }
    // return this.setState({ ...this.state, inputValue: event.target.value }, () => {
    // sets state to give value to input field
      // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue);
      // sets value in this.props and for submission of form
    // });
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      // console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }

  getStyleOfButtonElement({ required, value, choice, inactive, name }) {
    let elementStyle = {};

    // console.log('DocumentChoices, getStyleOfButton, name, typeof value, value, typeof choice.params.val, choice.params.val ', name, typeof value, value, typeof choice.params.val, choice.params.val);
    console.log('DocumentChoices, getStyleOfButton, name, value ', name, value);
    if ((value.toString().toLowerCase() == choice.params.val.toString().toLowerCase()) && !choice.params.enclosed_text) {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width };
    } else {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width };
    }

    if (this.props.nullRequiredField && !value) {
      elementStyle = { borderColor: 'blue', top: choice.params.top, left: choice.params.left, width: choice.params.width };
    }

    if (inactive) {
      elementStyle = { borderColor: 'transparent', top: choice.params.top, left: choice.params.left, width: choice.params.width };
    }

    return elementStyle;
  }

  getStyleOfInputElement(value, choice) {
    let elementStyle = {};
    // console.log('DocumentChoices, getStyleOfInputElement ');
    if (this.props.nullRequiredField && !value) {
      // elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'blue', width: choice.params.width };
      elementStyle = { borderColor: 'blue', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.font_size, textAlign: choice.params.text_align };
    } else {
      elementStyle = { borderColor: 'lightgray', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.font_size, textAlign: choice.params.text_align };
    }

    return elementStyle;
  }
  // https://stackoverflow.com/questions/37189881/how-to-clear-some-fields-in-form-redux-form
  changeOtherFieldValues(fields, meta, val) {
    _.each(fields, eachFieldName => {
      meta.dispatch({
        type: '@@redux-form/CHANGE',
        payload: val,
        meta: { ...meta, field: eachFieldName },
      });
    });
  }

  getSummaryKey(pageObject, wooden) {
    let objectReturned;
    _.each(Object.keys(pageObject), eachKey => {
      if ((pageObject[eachKey].wooden == wooden) && pageObject[eachKey].summaryKey) {
        objectReturned = pageObject[eachKey];
      }
    });
    // console.log('DocumentChoices, getSummaryKey objectReturned: ', objectReturned)
    return objectReturned;
  }

  checkOverAllDegradation({ pageObject, wooden, meta, lastClickedValue, name }) {
    let count = 0;
    _.each(pageObject, eachField => {
      // console.log('DocumentChoices, checkOverAllDegradation eachField: ', eachField)
      if (eachField.degradationKey && this.props.allValues[eachField.name] == 'Yes') {
        count++;
      }
    });
    count == 0 && lastClickedValue == 'Yes' ? count++ : '';
    // lastClickedValue == 'No' && count == 1 ? count-- : '';
    count == 1 && this.props.allValues[name] == 'Yes' && (lastClickedValue == 'Could not be investigated' || lastClickedValue == 'No') ? count-- : '';

    const summaryObject = this.getSummaryKey(pageObject, wooden);
    // console.log('DocumentChoices, checkOverAllDegradation summaryObject, count, this.props.allValues: ', summaryObject, count, this.props.allValues)

    if (count > 0) {
      this.changeOtherFieldValues([summaryObject.name], meta, true);
    } else {
      this.changeOtherFieldValues([summaryObject.name], meta, false);
    }
  }

  createButtonElement({ choice, meta, onChange, value, name }) {
    console.log('DocumentChoices, createButtonElement, name, choice, value', name, choice, value);

    const fieldInactive = (choice.inactive || this.props.formFields[this.props.page][name].inactive);
    return (
      <div
        key={choice.params.val}
        type={choice.params.input_type}
        onClick={() => {
          // check if inactive key
          // console.log('DocumentChoices, createButtonElement this.props.formFields[this.props.page][name]', this.props.formFields[this.props.page][name])
          if (!fieldInactive) {
            if (value == choice.params.val && this.props.formFields[this.props.page][name].second_click_off) {
              // this.setState({ enclosedText: '' });
              onChange('');
            } else {
              // check if click of button needs to change value of other keys
              if (choice.dependentKeys) {
                onChange(choice.params.val);
                if (choice.dependentKeys.value == 'self') {
                  // if value is 'self', change other field value to its own value
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.params.val);
                } else {
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.dependentKeys.value);
                }
              } else if (this.props.formFields[this.props.page][name].degradationKey) {
                // console.log('DocumentChoices, createButtonElement degradationKey true')
                this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.params.val, name } }, action: 'add' })
                onChange(choice.params.val);
                this.checkOverAllDegradation({ pageObject: this.props.formFields[this.props.page], wooden: this.props.formFields[this.props.page][name].wooden, meta, lastClickedValue: choice.params.val, name })
              } else {
                // if no need to change other field values, just chnage own field value
                this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.params.val, name } }, action: 'add' })
                onChange(choice.params.val);
              }
              // empty iput value of input field of same key
              this.emptyInput();
            } // end of first if value == choice.params.val
          } // end of if !inactive
        }}
        className={choice.params.class_name}
        // || (choice.params.val == this.props.allValues[choice.dependentKey])
        // style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}
        style={this.getStyleOfButtonElement({ required: this.props.required, value, choice, inactive: fieldInactive, name })}
      >
        {(choice.params.enclosed_text) && (value == choice.params.val) ? choice.params.enclosed_text : ''}
      </div>
    );
  }

  handleOnBlur(event) {
    const blurredInput = event.target
    // console.log('DocumentChoices, handleOnBlur, blurredInput', blurredInput);
    // console.log('DocumentChoices, handleOnBlur, this.state.valueWhenInputFocused', this.state.valueWhenInputFocused);
    if (blurredInput.value != this.state.valueWhenInputFocused) {
      const newEditHistoryItem = { before: { value: this.state.valueWhenInputFocused, name: blurredInput.name }, after: { value: blurredInput.value, name: blurredInput.name } }
      // this.setState(prevState => ({
      //   editHistory: [...prevState.editHistory, editHistoryItem]
      // })); // end of setState
      this.props.editHistory({ newEditHistoryItem, action: 'add' });
    }
  }

  handleOnFocus(event) {
    const focusedInput = event.target
    const valueWhenInputFocused = event.target.value
    this.setState({ focusedInput, valueWhenInputFocused }, () => {
      // console.log('DocumentChoices, handleOnFocus, this.state.focusedInput', this.state.focusedInput);
    })
  }

  createInputElement({ choice, meta, value, input, name }) {
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    // console.log('DocumentChoices, createInputElement, dirtyValue', dirtyValue);
    // console.log('DocumentChoices, createInputElement input, meta.dirty, value, this.props.dirtyFields', input, meta.dirty, value, this.props.dirtyFields);
    return (
        <input
          // No need to use input element value; update value directly with onChange in handleInputChange in RFv7.4.2
          // place {...input } above so input props won't override custom props
          // ... passes all input attributes onChange, onBlur, onFocus name, value etc allows foreign language input
          {...input}
          // value={this.props.otherChoiceValues.includes(value.toString().toLowerCase()) ? '' : value}
          // override standard input props below
          onChange={this.handleInputChange}
          id="valueInput"
          maxLength={this.props.charLimit}
          // value with this.state.inputValue is no longer need in RF v7.4.2;
          key={choice.params.val}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          type={choice.params.input_type}
          className={choice.params.class_name}
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderSelectOptions(choice) { 
    const emptyChoice = { value: '', en: '', jp: '' };
    // choice is mapped to a model in ../constant/
    const selectChoices = choice.selectChoices;
    // gets base language of document from ../constant/documents
    const documentBaseLanguage = Documents[this.props.documentKey].baseLanguage;
    // if choice in constants/... has attribute baseLanguageField: true,
    // assign the document base language, otherwise, use documentLanguageCode
    const language = choice.baseLanguageField ? documentBaseLanguage : this.props.documentLanguageCode;
    // console.log('DocumentChoices, renderSelectOptions language', language);
    selectChoices[10] = emptyChoice;
    return _.map(selectChoices, (eachChoice, i) => {
      // if (eachChoice.value != 'Wooden') {
      return <option key={i} value={eachChoice.value}>{choice.showLocalLanguage ? eachChoice[language] : eachChoice.value}</option>;
      // }
    });
  }

  createSelectElement({ choice, meta, value, input }) {
    console.log('DocumentChoices, createSelectElement');
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <select
          {...input}
          value={this.props.otherChoiceValues.includes(value.toString().toLowerCase()) ? '' : value}
          id="valueInput"
          maxLength={this.props.charLimit}
          key={choice.params.val}
          onChange={this.handleInputChange}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          type={choice.params.input_type}
          className={choice.params.class_name}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        >
        {this.renderSelectOptions(choice)}
        </select>
    );
  }

  createTextareaElement({ choice, value, input }) {
    console.log('DocumentChoices, createTextareaElement');
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <textarea
          {...input}
          id="valueTextarea"
          name={choice.params.name}
          maxLength={this.props.charLimit}
          // value={this.anyOfOtherValues(name, this.state.inputValue) ? '' : this.state.inputValue}
          // value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          // value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.params.val}
          // onChange={this.handleInputChange.bind(this)}
          type={choice.params.input_type}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          className={choice.params.class_name}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderEachChoice(choices) {
    const { input: { value, onChange, name, onBlur }, meta, input } = this.props;
    console.log('DocumentChoices, renderEachChoice name, value, input', name, value, input)
    // console.log('DocumentChoices, renderEachChoice this.props.otherChoiceValues', this.props.otherChoiceValues)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(choices, choice => {
        // console.log('DocumentChoices, renderEachChoice this.props.required', this.props.required);
      // console.log('DocumentChoices, renderEachChoice name, choice.params.val, value, choice.params.val == value', name, choice.params.val, value, choice.params.val == value);
      // value is value passed from Field and needs to be specified for initialValues
      // this.anyOfOtherValues checks if any of the other choice.params.val matches value,
      // if so do not use as value, use ''
      // if choice type is string, use input element above and button if not string
      if ((choice.params.input_type == 'string' || choice.params.input_type == 'date') && !choice.selectChoices ) {
        // define input element for user to input
        const inputElement = this.createInputElement({ choice, meta, value, onBlur, name, input: this.props.input })
        return inputElement;
      } else if (choice.params.input_type == 'text')  {
        const textareaElement = this.createTextareaElement({ choice, meta, value, input: this.props.input })
        return textareaElement;
      } else if (choice.selectChoices) {
        const selectElement = this.createSelectElement({ choice, meta, value, input: this.props.input })
        return selectElement;
      } else {
        const buttonElement = this.createButtonElement({ name, choice, onChange, meta, value, input: this.props.input })
        return buttonElement;
      }
    });
  }

  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { name } } = this.props;
    return (
      <div key={name}>
         {this.renderEachChoice(this.props.formFields[this.props.page][name].choices)}
        </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('in document_choices, mapStateToProps, state: ', state);
  // console.log('in document_choices, mapStateToProps: ');
  return {
    allValues: state.form.CreateEditDocument.values,
    registeredFields: state.form.CreateEditDocument.registeredFields,
    documentLanguageCode: state.languages.documentLanguageCode,
    editHistoryProp: state.documents.editHistory,
    dirtyFields: state.documents.dirtyObject,
  };
}

export default connect(mapStateToProps, actions)(DocumentChoices);
