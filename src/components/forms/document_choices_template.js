import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Documents from '../constants/documents';

// custom field component based on redux forms used for creating
// input and button inputs for forms
class DocumentChoicesTemplate extends Component {
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
    // console.log('DocumentChoicesTemplate, shouldComponentUpdate nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value', nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value);
    // console.log('DocumentChoicesTemplate, shouldComponentUpdate, nextProps, this.props', nextProps, this.props);
    // if (nextProps.meta.initial != this.props.meta.initial) {
    //   this.props.editHistory({ action: 'dirtyFieldCount', count: 1 })
    // }
    console.log('DocumentChoicesTemplate, shouldComponentUpdate nextProps.eachElement, this.props.eachElement, nextProps.eachElement === this.props.eachElement', nextProps.eachElement, this.props.eachElement, nextProps.eachElement !== this.props.eachElement);
    let elementChanged = false;
    let valueUpdated = false;
    if (this.props.editTemplate) elementChanged = nextProps.eachElement !== this.props.eachElement
    valueUpdated = nextProps.input.value != this.props.input.value;
    return elementChanged || valueUpdated;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('DocumentChoicesTemplate, componentDidUpdate prevState.focusedInput', prevState.focusedInput);
  //   console.log('DocumentChoicesTemplate, componentDidUpdate this.state.focusedInput', this.state.focusedInput);
  //   console.log('DocumentChoicesTemplate, componentDidUpdate this.state.blurredInput', this.state.blurredInput);
  //   console.log('DocumentChoicesTemplate, componentDidUpdate prevState.blurredInput', prevState.blurredInput);
  // }
  // Take user input in input element
  handleInputChange(event) {
    // destructure local props from Field element of Redux Forms
    // value is what is submitted in submit form data
    // onChange sets value of Field
    // name is the Field name that corresponds to DB column name
    // custom props eg charLimit does not destructure for some reason
    const { input: { value, onChange, name }, meta, input } = this.props;
    // console.log('DocumentChoicesTemplate, handleInputChange event.target.value', event.target.value);
    // !!!!No need to use input element value props; update value directly with onChange in handleInputChange in RFv7.4.2
    onChange(event.target.value);
    console.log('DocumentChoicesTemplate, handleInputChange input, meta, meta.dirty, value, event.target.value, this.props.dirtyFields', input,meta,  meta.dirty, value, event.target.value, this.props.dirtyFields);
    // check if name is false in dirtyFields in state; if so flip
    // if (this.props.dirtyFields[name] != meta.dirty) {
    //   this.props.editHistory({ editHistoryItem: null, action: 'flipDirtyField', name, dirty: meta.dirty })
    // }
    // return this.setState({ ...this.state, inputValue: event.target.value }, () => {
    // sets state to give value to input field
      // console.log('DocumentChoicesTemplate, handleInputChange this.state.inputValue', this.state.inputValue);
      // sets value in this.props and for submission of form
    // });
  }
  // empty input element when user clicks on button
  emptyInput() {
    return this.setState({ inputValue: '' }, () => {
      // console.log('DocumentChoicesTemplate, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }

  getStyleOfButtonElement({ required, value, choice, inactive, name }) {
    let elementStyle = {};

    // console.log('DocumentChoicesTemplate, getStyleOfButton, name, typeof value, value, typeof choice.val, choice.val ', name, typeof value, value, typeof choice.val, choice.val);
    console.log('DocumentChoicesTemplate, getStyleOfButton, name, value ', name, value);
    if ((value.toString().toLowerCase() == choice.val.toString().toLowerCase()) && !choice.enclosed_text) {
      elementStyle = { top: choice.top, left: choice.left, borderColor: 'black', width: choice.width };
    } else {
      elementStyle = { top: choice.top, left: choice.left, borderColor: 'lightgray', width: choice.width };
    }

    if (this.props.nullRequiredField && !value) {
      elementStyle = { borderColor: 'blue', top: choice.top, left: choice.left, width: choice.width };
    }

    if (inactive) {
      elementStyle = { borderColor: 'transparent', top: choice.top, left: choice.left, width: choice.width };
    }

    return elementStyle;
  }

  getStyleOfInputElement(value, choice) {
    let elementStyle = {};
    console.log('DocumentChoicesTemplate, getStyleOfInputElement, value, choice ', value, choice);
    if (this.props.nullRequiredField && !value) {
      // elementStyle = { top: choice.top, left: choice.left, borderColor: 'blue', width: choice.width };
      elementStyle = { borderColor: 'blue', padding: '0px', top: choice.top, left: choice.left, width: choice.width, height: choice.height, fontSize: choice.font_size, textAlign: choice.text_align };
    } else {
      elementStyle = { borderColor: 'lightgray', padding: '0px', top: choice.top, left: choice.left, width: choice.width, height: choice.height, fontSize: choice.font_size, textAlign: choice.text_align };
    }

    if (this.props.editTemplate) {
      elementStyle = {
          width: '100%',
          height: '100%',
          fontSize: choice.font_size,
          fontFamily: choice.font_family,
          fontStyle: choice.font_style,
          fontWeight: choice.font_weight,
          borderColor: choice.border_color,
          margin: '0px !important',
          flex: '1 1 auto'
        };
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
    // console.log('DocumentChoicesTemplate, getSummaryKey objectReturned: ', objectReturned)
    return objectReturned;
  }

  checkOverAllDegradation({ pageObject, wooden, meta, lastClickedValue, name }) {
    let count = 0;
    _.each(pageObject, eachField => {
      // console.log('DocumentChoicesTemplate, checkOverAllDegradation eachField: ', eachField)
      if (eachField.degradationKey && this.props.allValues[eachField.name] == 'Yes') {
        count++;
      }
    });
    count == 0 && lastClickedValue == 'Yes' ? count++ : '';
    // lastClickedValue == 'No' && count == 1 ? count-- : '';
    count == 1 && this.props.allValues[name] == 'Yes' && (lastClickedValue == 'Could not be investigated' || lastClickedValue == 'No') ? count-- : '';

    const summaryObject = this.getSummaryKey(pageObject, wooden);
    // console.log('DocumentChoicesTemplate, checkOverAllDegradation summaryObject, count, this.props.allValues: ', summaryObject, count, this.props.allValues)

    if (count > 0) {
      this.changeOtherFieldValues([summaryObject.name], meta, true);
    } else {
      this.changeOtherFieldValues([summaryObject.name], meta, false);
    }
  }

  createButtonElement({ choice, meta, onChange, value, name }) {
    console.log('DocumentChoicesTemplate, createButtonElement, name, choice, value', name, choice, value);

    const fieldInactive = (choice.inactive || this.props.formFields[this.props.page][name].inactive);
    return (
      <div
        key={choice.val}
        type={choice.input_type}
        onClick={() => {
          // check if inactive key
          // console.log('DocumentChoicesTemplate, createButtonElement this.props.formFields[this.props.page][name]', this.props.formFields[this.props.page][name])
          if (!fieldInactive) {
            if (value == choice.val && this.props.formFields[this.props.page][name].second_click_off) {
              // this.setState({ enclosedText: '' });
              onChange('');
            } else {
              // check if click of button needs to change value of other keys
              if (choice.dependentKeys) {
                onChange(choice.val);
                if (choice.dependentKeys.value == 'self') {
                  // if value is 'self', change other field value to its own value
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.val);
                } else {
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.dependentKeys.value);
                }
              } else if (this.props.formFields[this.props.page][name].degradationKey) {
                // console.log('DocumentChoicesTemplate, createButtonElement degradationKey true')
                this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.val, name } }, action: 'add' })
                onChange(choice.val);
                this.checkOverAllDegradation({ pageObject: this.props.formFields[this.props.page], wooden: this.props.formFields[this.props.page][name].wooden, meta, lastClickedValue: choice.val, name })
              } else {
                // if no need to change other field values, just chnage own field value
                this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.val, name } }, action: 'add' })
                onChange(choice.val);
              }
              // empty iput value of input field of same key
              this.emptyInput();
            } // end of first if value == choice.val
          } // end of if !inactive
        }}
        className={choice.class_name}
        // || (choice.val == this.props.allValues[choice.dependentKey])
        // style={value == choice.val ? { top: choice.top, left: choice.left, borderColor: 'black', width: choice.width } : { top: choice.top, left: choice.left, borderColor: 'lightgray', width: choice.width }}
        style={this.getStyleOfButtonElement({ required: this.props.required, value, choice, inactive: fieldInactive, name })}
      >
        {(choice.enclosed_text) && (value == choice.val) ? choice.enclosed_text : ''}
      </div>
    );
  }

  handleOnBlur(event) {
    const blurredInput = event.target
    // console.log('DocumentChoicesTemplate, handleOnBlur, blurredInput', blurredInput);
    // console.log('DocumentChoicesTemplate, handleOnBlur, this.state.valueWhenInputFocused', this.state.valueWhenInputFocused);
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
      // console.log('DocumentChoicesTemplate, handleOnFocus, this.state.focusedInput', this.state.focusedInput);
    })
  }

  createInputElement({ choice, meta, value, input, name }) {
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    // console.log('DocumentChoicesTemplate, createInputElement, dirtyValue', dirtyValue);
    // console.log('DocumentChoicesTemplate, createInputElement input, meta.dirty, value, this.props.dirtyFields', input, meta.dirty, value, this.props.dirtyFields);
    return (
      <input
        // No need to use input element value; update value directly with onChange in handleInputChange in RFv7.4.2
        // place {...input } above so input props won't override custom props
        // ... passes all input attributes onChange, onBlur, onFocus name, value etc allows foreign language input
        {...input}
        // value={this.props.otherChoiceValues.includes(value.toString().toLowerCase()) ? '' : value}
        // override standard input props below
        onChange={this.handleInputChange}
        // id="valueInput"
        id={this.props.editTemplate ? `template-element-input-${choice.element_id}` : 'valueTextarea'}
        maxLength={this.props.charLimit}
        // value with this.state.inputValue is no longer need in RF v7.4.2;
        key={choice.val}
        onBlur={this.handleOnBlur}
        onFocus={this.handleOnFocus}
        type={choice.input_type}
        className={choice.class_name}
        // placeholder={choice.placeholder}
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
    // console.log('DocumentChoicesTemplate, renderSelectOptions language', language);
    selectChoices[10] = emptyChoice;
    return _.map(selectChoices, (eachChoice, i) => {
      // if (eachChoice.value != 'Wooden') {
      return <option key={i} value={eachChoice.value}>{choice.showLocalLanguage ? eachChoice[language] : eachChoice.value}</option>;
      // }
    });
  }

  createSelectElement({ choice, meta, value, input }) {
    console.log('DocumentChoicesTemplate, createSelectElement');
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <select
          {...input}
          // value={this.props.otherChoiceValues.includes(value.toString().toLowerCase()) ? '' : value}
          value={(this.props.otherChoiceValues.indexOf(value.toString().toLowerCase()) !== -1) ? '' : value}
          id="valueInput"
          maxLength={this.props.charLimit}
          key={choice.val}
          onChange={this.handleInputChange}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          type={choice.input_type}
          className={choice.class_name}
          // style={{ borderColor: 'lightgray', top: choice.top, left: choice.left, width: choice.width }}
          style={this.getStyleOfInputElement(value, choice)}
        >
        {this.renderSelectOptions(choice)}
        </select>
    );
  }

  createTextareaElement({ choice, value, input }) {
    console.log('DocumentChoicesTemplate, createTextareaElement choice, value, input', choice, value, input);
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <textarea
          {...input}
          id={this.props.editTemplate ? `template-element-input-${choice.element_id}` : 'valueTextarea'}
          // id={'valueTextarea'}
          name={choice.name}
          maxLength={this.props.charLimit}
          // value={this.anyOfOtherValues(name, this.state.inputValue) ? '' : this.state.inputValue}
          // value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          // value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.val}
          onChange={this.handleInputChange}
          type={choice.input_type}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          className={choice.class_name}
          // width={choice.width}
          // height={choice.height}
          // style={{ borderColor: 'lightgray', top: choice.top, left: choice.left, width: choice.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderEachChoice(choices) {
    const { input: { value, onChange, name, onBlur }, meta, input } = this.props;
    console.log('DocumentChoicesTemplate, renderEachChoice name, value, input, this.props.', name, value, input, this.props)
    // console.log('DocumentChoicesTemplate, renderEachChoice this.props.otherChoiceValues', this.props.otherChoiceValues)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(choices, choice => {
        // console.log('DocumentChoicesTemplate, renderEachChoice this.props.required', this.props.required);
      // console.log('DocumentChoicesTemplate, renderEachChoice name, choice.val, value, choice.val == value', name, choice.val, value, choice.val == value);
      // value is value passed from Field and needs to be specified for initialValues
      // this.anyOfOtherValues checks if any of the other choice.val matches value,
      // if so do not use as value, use ''
      // if choice type is string, use input element above and button if not string
      if ((choice.input_type == 'string' || choice.input_type == 'date') && !choice.selectChoices ) {
        // define input element for user to input
        const inputElement = this.createInputElement({ choice, meta, value, onBlur, name, input: this.props.input })
        return inputElement;
      } else if (choice.input_type == 'text')  {
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
    console.log('in document_choices_template, render, name, this.props.elementName, this.props.formFields[this.props.page]: ', name, this.props.elementName, this.props.formFields);
    // if (this.props.editTemplate) {
    return (
      <div key={name} style={this.props.editTemplate ? { width: '100%', height: `${this.props.wrappingDivDocumentCreateH * 100}%` } : {}}>
        {this.renderEachChoice(this.props.formFields[this.props.page][this.props.elementId].choices)}
      </div>
    );
    // }
    // else return below
    // return (
    //   <div key={name}>
    //   {this.renderEachChoice(this.props.formFields[this.props.page][name].choices)}
    //   </div>
    // );
  }
}

function mapStateToProps(state) {
  // console.log('in document_choices_template, mapStateToProps, state: ', state);
  // console.log('in document_choices_template, mapStateToProps: ');
  return {
    allValues: state.form.CreateEditDocument.values,
    registeredFields: state.form.CreateEditDocument.registeredFields,
    documentLanguageCode: state.languages.documentLanguageCode,
    editHistoryProp: state.documents.editHistory,
    dirtyFields: state.documents.dirtyObject,
  };
}

export default connect(mapStateToProps, actions)(DocumentChoicesTemplate);