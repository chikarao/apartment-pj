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
    // console.log('DocumentChoices, handleInputChange this.props, this.props.change', this.props, this.props.change);
    // sets state to give value to input field
    return this.setState({ inputValue: event.target.value }, () => {
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

  getStyleOfButtonElement(required, value, choice) {
    let elementStyle = {};

    // console.log('DocumentChoices, getStyleOfButtonElement, required, value, choice.val ', required, value, choice.params.val);
    if ((value.toString().toLowerCase() === choice.params.val.toString().toLowerCase()) && !choice.params.enclosedText) {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width };
    } else {
      elementStyle = { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width };
    }

    if (this.props.nullRequiredField && !value) {
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

  changeOtherFieldValues(fields, meta, val) {
    _.each(fields, eachFieldName => {
      meta.dispatch({
        type: '@@redux-form/CHANGE',
        payload: val,
        meta: { ...meta, field: eachFieldName },
      });
    });
  }

  createButtonElement({ choice, meta, onChange, value, name }) {
    return (
      <div
        key={choice.params.val}
        type={choice.params.type}
        onClick={() => {
          if (!choice.inactive) {
            if (value == choice.params.val && this.props.formFields[this.props.page][name].second_click_off) {
              // this.setState({ enclosedText: '' });
              onChange('');
            } else {
              if (choice.dependentKeys) {
                onChange(choice.params.val);
                if (choice.dependentKeys.value == 'self') {
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.params.val);
                } else {
                  this.changeOtherFieldValues(choice.dependentKeys.fields, meta, choice.dependentKeys.value);
                }
              } else {
                onChange(choice.params.val);
              }
              this.emptyInput();
            } // end of first if value == choice.params.val
          } // end of if !inactive
        }}
        className={choice.params.className}
        // || (choice.params.val == this.props.allValues[choice.dependentKey])
        // style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}
        style={this.getStyleOfButtonElement(this.props.required, value, choice)}
      >{(choice.params.enclosedText) && (value == choice.params.val) ? choice.params.enclosedText : ''}</div>
    );
  }

  createInactiveButtonElement({ choice, onChange, value, name }) {
    return (
      <div
        key={choice.params.val}
        type={choice.params.type}
        // onClick={() => {
        //   if (value == choice.params.val && this.props.formFields[this.props.page][name].second_click_off) {
        //     // this.setState({ enclosedText: '' });
        //     onChange('');
        //   } else {
        //     // this.handleInputChange.bind(this)
        //     // this.setState({ enclosedText: choice.params.enclosedText });
        //     onChange(choice.params.val);
        //     if (choice.params.otherValueNull) {
        //       // console.log('DocumentChoices, renderEachChoice name, value, choice.params.otherValueNull, this.props', name, value, choice.params.otherValueNull, this.props);
        //     }
        //     this.emptyInput();
        //   }
        // }}
        className={choice.params.className}
        // || (choice.params.val == this.props.allValues[choice.dependentKey])
        // style={value == choice.params.val ? { top: choice.params.top, left: choice.params.left, borderColor: 'black', width: choice.params.width } : { top: choice.params.top, left: choice.params.left, borderColor: 'lightgray', width: choice.params.width }}
        style={this.getStyleOfButtonElement(this.props.required, value, choice)}
      // >{(choice.params.enclosedText) && (value == this.props.allValues[choice.dependentKey]) ? choice.params.enclosedText : ''}</div>
      >{(choice.params.enclosedText) && (value == choice.params.val) ? choice.params.enclosedText : ''}</div>
    );
  }

  createInputElement({ choice, meta, value }) {
    const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
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
          type={choice.params.type}
          className={choice.params.className}
          // style={{ borderColor: 'lightgray', top: choice.params.top, left: choice.params.left, width: choice.params.width }}
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderEachChoice() {
    const { input: { value, onChange, name }, meta } = this.props;
    console.log('DocumentChoices, renderEachChoice name, value, this.props', name, value, this.props)
    // console.log('DocumentChoices, renderEachChoice this.props.otherChoiceValues', this.props.otherChoiceValues)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    return _.map(this.props.formFields[this.props.page][name].choices, choice => {
        // console.log('DocumentChoices, renderEachChoice this.props.required', this.props.required);
      // console.log('DocumentChoices, renderEachChoice name, choice.params.val, value, choice.params.val == value', name, choice.params.val, value, choice.params.val == value);
      // value is value passed from Field and needs to be specified for initialValues
      // this.anyOfOtherValues checks if any of the other choice.params.val matches value,
      // if so do not use as value, use ''
      // if choice type is string, use input element above and button if not string
      if (choice.params.type == 'string' || choice.params.type == 'date') {
        // define input element for user to input
        const inputElement = this.createInputElement({ choice, meta, value })
        return inputElement;
      } else if (choice.params.type == 'text')  {
        const textareaElement = this.createTextareaElement({ choice, meta, value })
        return textareaElement;
      } else {
        // define button element for user to click to set value in submission
        // if (choice.dependentKey) {
        //   const buttonElement = this.createInactiveButtonElement({ choice, onChange, value, name })
        //   return buttonElement;
        // } else {
        const buttonElement = this.createButtonElement({ choice, onChange, meta, value, name })
        return buttonElement;
        // }
      }
    });
  }
  render() {
    // destructure local props set by redux forms Field compoenent
    const { input: { name } } = this.props;
    return (
      <div key={name}>
         {this.renderEachChoice()}
        </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('in document_choices, mapStateToProps, state: ', state);
  return {
    allValues: state.form.CreateEditDocument.values,
    registeredFields: state.form.CreateEditDocument.registeredFields
  };
}

export default connect(mapStateToProps, actions)(DocumentChoices);
