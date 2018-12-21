import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

// custom field component based on redux forms used for creating
// input and button inputs for forms
class DocumentChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      inputValue: '',
      enclosedText: ''
    };
  }

  shouldComponentUpdate(nextProps) {
    // checks to find out if each field value has changed, and if not will not call componentDidUpdate
    // console.log('DocumentChoices, shouldComponentUpdate nextProps.input, this.props.input, nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value', nextProps.input, this.props.input, nextProps.input.value, this.props.input.value, nextProps.input.value != this.props.input.value);
    return nextProps.input.value != this.props.input.value;
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
    return this.setState({ ...this.state, inputValue: event.target.value }, () => {
      console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue);
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

  getStyleOfButtonElement(required, value, choice, inactive) {
    let elementStyle = {};

    // console.log('DocumentChoices, getStyleOfButtonElement, required, value, choice.val ', required, value, choice.params.val);
    if ((value.toString().toLowerCase() === choice.params.val.toString().toLowerCase()) && !choice.params.enclosed_text) {
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
      elementStyle = { borderColor: 'blue', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.font_size };
    } else {
      elementStyle = { borderColor: 'lightgray', padding: '0px', top: choice.params.top, left: choice.params.left, width: choice.params.width, height: choice.params.height, fontSize: choice.params.font_size };
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
    console.log('DocumentChoices, checkOverAllDegradation summaryObject, count, this.props.allValues: ', summaryObject, count, this.props.allValues)

    if (count > 0) {
      this.changeOtherFieldValues([summaryObject.name], meta, true);
    } else {
      this.changeOtherFieldValues([summaryObject.name], meta, false);
    }
  }

  createButtonElement({ choice, meta, onChange, value, name }) {
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
                onChange(choice.params.val);
                this.checkOverAllDegradation({ pageObject: this.props.formFields[this.props.page], wooden: this.props.formFields[this.props.page][name].wooden, meta, lastClickedValue: choice.params.val, name })
              } else {
                // if no need to change other field values, just chnage own field value
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
        style={this.getStyleOfButtonElement(this.props.required, value, choice, fieldInactive)}
      >{(choice.params.enclosed_text) && (value == choice.params.val) ? choice.params.enclosed_text : ''}</div>
    );
  }

  createInputElement({ choice, meta, value, input }) {
    console.log('DocumentChoices, createInputElement choice, meta, input', choice, meta, input);
    // const dirtyValue = this.state.inputValue || value;
    const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <input
          id="valueInput"
          maxLength={this.props.charLimit}
          value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          // value={dirtyValue}
          key={choice.params.val}
          onChange={this.handleInputChange.bind(this)}
          type={choice.params.input_type}
          className={choice.params.class_name}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
          // ... passes all input attributes onChange, onBlur, onFocus etc allows foreign language input 
          {...input}
        />
    );
  }

  renderSelectOptions(choice) {
    // console.log('DocumentChoices, renderSelectOptions choice', choice);
    const emptyChoice = { value: '', en: '', jp: '' };
    const choiceToChange = choice.selectChoices;
    choiceToChange[10] = emptyChoice;
    return _.map(choiceToChange, (eachChoice, i) => {
      // if (eachChoice.value != 'Wooden') {
        return <option key={i} value={eachChoice.value}>{choice.showLocalLanguage ? eachChoice[this.props.documentLanguageCode] : eachChoice.value}</option>;
      // }
    });
  }

  createSelectElement({ choice, meta, value }) {
    const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <select
          id="valueInput"
          maxLength={this.props.charLimit}
          value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.params.val}
          onChange={this.handleInputChange.bind(this)}
          type={choice.params.input_type}
          className={choice.params.class_name}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        >
        {this.renderSelectOptions(choice)}
        </select>
    );
  }

  createTextareaElement({ choice, meta, value }) {
    const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <textarea
          id="valueTextarea"
          name={choice.params.name}
          maxLength={this.props.charLimit}
          // value={this.anyOfOtherValues(name, this.state.inputValue) ? '' : this.state.inputValue}
          // value={this.anyOfOtherValues(name, dirtyValue) ? '' : dirtyValue}
          value={this.props.otherChoiceValues.includes(dirtyValue.toString().toLowerCase()) ? '' : dirtyValue}
          key={choice.params.val}
          onChange={this.handleInputChange.bind(this)}
          type={choice.params.input_type}
          className={choice.params.class_name}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderEachChoice(choices) {
    const { input: { value, onChange, name }, meta } = this.props;
    // console.log('DocumentChoices, renderEachChoice name, value, this.props', name, value, this.props)
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
        const inputElement = this.createInputElement({ choice, meta, value, input: this.props.input })
        return inputElement;
      } else if (choice.params.input_type == 'text')  {
        const textareaElement = this.createTextareaElement({ choice, meta, value })
        return textareaElement;
      } else if (choice.selectChoices) {
        const selectElement = this.createSelectElement({ choice, meta, value })
        return selectElement;
      } else {
        const buttonElement = this.createButtonElement({ name, choice, onChange, meta, value, name })
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
  return {
    allValues: state.form.CreateEditDocument.values,
    registeredFields: state.form.CreateEditDocument.registeredFields,
    documentLanguageCode: state.languages.documentLanguageCode
  };
}

export default connect(mapStateToProps, actions)(DocumentChoices);
