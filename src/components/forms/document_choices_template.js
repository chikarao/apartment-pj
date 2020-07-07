import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Documents from '../constants/documents';
import AppLanguages from '../constants/app_languages';

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
    // this.handleButtonTemplateElementMove = this.handleButtonTemplateElementMove.bind(this);
  }

  componentDidMount() {
    // IMPORTANT: When template elements are created, the wrapper div top and left
    // are given a value based on user mouse click coordinates;
    // The document_field_choices are not given top and left;
    // When the new elements are first rendered, renderTemplateElements in creat_edit_document.js
    // calculates the wrapperdiv dimensions based on the user click coordinates and the sizes
    // height and width of each of the document_field_choices.
    // this componentDidMount takes the newElement marked newElement in this.props
    // and uses the handler for elementDrag to get the coordinates of the document_field_choices
    if (this.props.newElement) {
      // console.log('DocumentChoicesTemplate, componentDidMount this.props, this.props.formFields[this.props.page], this.props.newElement', this.props, this.props.formFields[this.props.page], this.props.newElement);
      // Call the getChoiceCoordinates with element id fromDocumentChoices flag true
      // so that dragElement does not set onmousemove and onmouseup and leaves them null
      // and dragElement can simply call closeDragElement() where the choice coordinate
      // and wrapperDiv size calculation, as well as action creator is called
      this.props.getChoiceCoordinates({ id: this.props.eachElement.id, fromDocumentChoices: true });
    }
  }


  shouldComponentUpdate(nextProps) {
    // IMPORTANT: Checks to find out if each field value has changed, and if not will not call componentDidUpdate
    // Look here if any changes in state are not reflected in choices rendered. They are probably not updated here.
    let elementChanged = false;
    let choicesChanged = false;
    let valueUpdated = false;
    let choiceSelectedUnselected = false;
    let formFieldChanged = false;
    // console.log('DocumentChoicesTemplate, shouldComponentUpdate nextProps.formFields, this.props.formFields, nextProps.formFields !== this.props.formFields', nextProps.formFields, this.props.formFields, nextProps.formFields !== this.props.formFields);

    if (this.props.selectedChoiceIdArray) {
      choiceSelectedUnselected = this.props.selectedChoiceIdArray.length !== nextProps.selectedChoiceIdArray.length;
    }

    const editFieldOnChanged = nextProps.editFieldsOn !== this.props.editFieldsOn;

    if (this.props.editTemplate) {
      elementChanged = nextProps.eachElement !== this.props.eachElement
    }

    valueUpdated = nextProps.input.value != this.props.input.value;
    // console.log('DocumentChoicesTemplate, shouldComponentUpdate elementChanged, valueUpdated, editFieldOnChanged, choiceSelectedUnselected', elementChanged, valueUpdated, editFieldOnChanged, choiceSelectedUnselected);
    // console.log('DocumentChoicesTemplate, shouldComponentUpdate (elementChanged || valueUpdated || editFieldOnChanged || choiceSelectedUnselected)', (elementChanged || valueUpdated || editFieldOnChanged || choiceSelectedUnselected));

    return elementChanged || valueUpdated || editFieldOnChanged || choiceSelectedUnselected;
  }

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
    // Use changeValue variable to deal with boolean select choice values
    // since event.target.value is a string
    let changeValue = null;
    event.target.value === 'true' ? changeValue = true : changeValue = event.target.value;
    event.target.value === 'false' ? changeValue = false : changeValue;
    // onChange(event.target.value);
    onChange(changeValue);
    // console.log('DocumentChoicesTemplate, handleInputChange input, meta, meta.dirty, value, event.target.value, this.props.dirtyFields', input,meta,  meta.dirty, value, event.target.value, this.props.dirtyFields);
    console.log('DocumentChoicesTemplate, handleInputChange value, event.target.value, changeValue', value, event.target.value, changeValue);
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
    let elementStyle = { color: 'lightgray', textAlign: 'center', fontSize: '11px', padding: '1px' };

    // console.log('DocumentChoicesTemplate, getStyleOfButton, name, typeof value, value, typeof choice.val, choice.val ', name, typeof value, value, typeof choice.val, choice.val);
    console.log('DocumentChoicesTemplate, getStyleOfButton, name, value, choice, this.props.selectedChoiceIdArray ', name, value, choice, this.props.selectedChoiceIdArray);
    if (((value.toString().toLowerCase() == choice.val.toString().toLowerCase()) || (typeof value === 'boolean' && value.toString().toLowerCase()[0] === choice.val.toString().toLowerCase())) && !choice.enclosed_text) {
      elementStyle = { ...elementStyle, top: choice.top, left: choice.left, borderColor: this.props.editFieldsOn ? 'lightgray' : 'black', width: choice.width, height: choice.height };
    } else {
      elementStyle = { ...elementStyle, top: choice.top, left: choice.left, borderColor: 'lightgray', width: choice.width, height: choice.height };
    }

    if (this.props.nullRequiredField && !value) {
      elementStyle = { ...elementStyle, borderColor: 'blue', top: choice.top, left: choice.left, width: choice.width, height: choice.height };
    }

    if (inactive) {
      elementStyle = { ...elementStyle, borderColor: 'transparent', top: choice.top, left: choice.left, width: choice.width, height: choice.height };
    }

    if (this.props.selectedChoiceIdArray.indexOf(`${choice.element_id}-${choice.choice_index}`) !== -1) {
      console.log('DocumentChoicesTemplate, test for 1a-0 getStyleOfButton, in if selectedChoiceIdArray name, value, choice, this.props.selectedChoiceIdArray ', name, value, choice, this.props.selectedChoiceIdArray);
      elementStyle = { ...elementStyle, borderColor: 'green', top: choice.top, left: choice.left, width: choice.width, height: choice.height };
    }

    return elementStyle;
  }

  getStyleOfInputElement(value, choice) {
    const { eachElement, editFieldsOn, nullRequiredField, translationModeOn } = this.props;
    let elementStyle = {};
    if (nullRequiredField && !value) {
      // elementStyle = { top: choice.top, left: choice.left, borderColor: 'blue', width: choice.width };
      elementStyle = { borderColor: 'blue', padding: '0px', top: choice.top, left: choice.left, width: choice.width, height: choice.height, fontSize: choice.font_size, textAlign: choice.text_align };
    } else {
      elementStyle = { borderColor: 'lightgray', padding: '0px', top: choice.top, left: choice.left, width: choice.width, height: choice.height, fontSize: choice.font_size, textAlign: choice.text_align };
    }
    // Set initially at values for elements going inside a wrapper div
    // let height = '100%';
    // let width = '100%';
    // let top = '';
    // let left = '';
    let height = !this.props.editFieldsOn ? choice.height : '100%';
    let width = !this.props.editFieldsOn ? choice.width : '100%';
    let top = !this.props.editFieldsOn ? choice.top : '';
    let left = !this.props.editFieldsOn ? choice.left : '';
    let position = !this.props.editFieldsOn ? 'absolute' : '';
    // If being rendered without a wrapper ie just an input, assign the choice values
    console.log('DocumentChoicesTemplate, getStyleOfInputElement, eachElement value, choice, elementStyle ', eachElement, value, choice, elementStyle);
    if (translationModeOn && !eachElement.translation_element) {
      height = choice.height;
      width = choice.width;
      top = choice.top;
      left = choice.left;
      position = 'absolute';
      // height = editFieldsOn ? height : choice.height;
      // width = editFieldsOn ? width : choice.width;
      // top = editFieldsOn ? top : choice.top;
      // left = editFieldsOn ? left : choice.left;
    }
    const selectChoices = choice.selectChoices || choice.select_choices;
    // If selectChoices in choice object, get width and height from choice
    if (this.props.editTemplate) {
      elementStyle = {
        width: selectChoices ? choice.width : width,
        height: selectChoices ? choice.height : height,
        top: selectChoices ? choice.top : top,
        left: selectChoices ? choice.left : left,
        fontSize: selectChoices ? eachElement.font_size : choice.font_size,
        fontFamily: selectChoices ? eachElement.font_family : choice.font_family,
        fontStyle: selectChoices ? eachElement.font_style : choice.font_style,
        fontWeight: selectChoices ? eachElement.font_weight : choice.font_weight,
        borderColor: selectChoices ? eachElement.font_color : choice.border_color,
        position,
        margin: '0px !important',
        flex: '1 1 auto'
      };
    }

    console.log('DocumentChoicesTemplate, getStyleOfInputElement, eachElement value, choice, elementStyle ', eachElement, value, choice, elementStyle);
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

  createButtonElement({ choice, meta, onChange, value, name, input }) {
    const elementIdAndIndex = `${choice.element_id},${choice.choice_index}`

    const handleClick = () => {
      console.log('DocumentChoicesTemplate, createButtonElement, handleClick, before if editFieldsOn', this.props.editFieldsOn);

      if (!fieldInactive) {
        if (value == choice.val && this.props.formFields[this.props.page][this.props.elementId].second_click_off) {
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
          } else if (this.props.formFields[this.props.page][this.props.elementId].degradationKey) {
            // console.log('DocumentChoicesTemplate, createButtonElement degradationKey true')
            this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.val, name } }, action: 'add' })
            onChange(choice.val);
            this.checkOverAllDegradation({ pageObject: this.props.formFields[this.props.page], wooden: this.props.formFields[this.props.page][this.props.elementId].wooden, meta, lastClickedValue: choice.val, name })
          } else {
            // if no need to change other field values, just chnage own field value
            this.props.editHistory({ newEditHistoryItem: { before: { value, name }, after: { value: choice.val, name } }, action: 'add' })
            onChange(choice.val);
          }
          // empty iput value of input field of same key
          this.emptyInput();
        } // end of first if value == choice.val
      } // end of if !inactive
    };

    const fieldInactive = (choice.inactive || this.props.formFields[this.props.page][this.props.elementId].inactive);

    if (this.props.editFieldsOn) {
    // if (this.props.handleButtonTemplateElementMove && this.props.handleButtonTemplateElementClick && this.props.editFieldsOn) {
      // Takes choices i.e. name: { choices: { 0: {params...}, 1: {params..}}}
      // If there is a return condition the 'some' function terminates the loop and returns
      const getTranslation = (choices) => {
        let returnObject = null;
        // Object.keys(choices).some((eachChoice) => {
        //   if (choices[eachChoice].params.val === choice.val) {
        //     returnObject = choices[eachChoice].translation;
        //     return returnObject;
        //   }
        // });
        if (choices[choice.val] && choices[choice.val].translation) returnObject = choices[choice.val].translation;
        if (choices.inputFieldValue && choices.inputFieldValue.selectChoices) returnObject = choices.inputFieldValue.selectChoices[choice.val];
        // console.log('DocumentChoicesTemplate, createButtonElement, getTranslation, choices, choice, returnObject, this.props.appLanguageCode: ', choices, choice, returnObject, this.props.appLanguageCode);
        return returnObject;
      };

      let choiceTranslations = null;
      // Get the object for the field name from the all object fixedTermRentalContractBilingualAll or ImportantPointsExplanationBilingualAll
      const elementObject = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey][name];
      // if the object exists, get the translation for the choice
      if (elementObject) choiceTranslations = getTranslation(elementObject.choices);
      // console.log('DocumentChoicesTemplate, createButtonElement, name, choice, value, elementObject, choiceTranslations', name, choice, value, elementObject, choiceTranslations);

      // const buttonText = AppLanguages[choice.val] ? AppLanguages[choice.val][this.props.appLanguageCode] : choice.val;
      const buttonText = choiceTranslations && choiceTranslations[this.props.appLanguageCode].length < 12 && choice.val ? choiceTranslations[this.props.appLanguageCode] : choice.val;
      return (
        <div
          key={choice.val}
          type={choice.input_type}
          // value={`${choice.element_id},${choice.choice_index}`}
          value={`${choice.element_id},${choice.choice_index}`}
          id={`template-element-button-${elementIdAndIndex}`}
          onMouseDown={this.props.handleButtonTemplateElementMove()}
          onClick={this.props.handleButtonTemplateElementClick()}
          className={choice.class_name}
          style={this.getStyleOfButtonElement({ required: this.props.required, value, choice, inactive: fieldInactive, name })}
        >
        {(choice.enclosed_text) && (value == choice.val) ? choice.enclosed_text : ''}
        {choice.val === 'inputFieldValue' ? 'Select' : buttonText}
        {choice.val.toString() === 'true' && choice.val === true ? 'Y' : ''}
        {choice.val.toString() === 'false' && choice.val === false ? 'N' : ''}
        </div>
      );
    }
    // else editFieldsOn is false
    return (
      <div
        key={choice.val}
        type={choice.input_type}
        value={`${choice.element_id},${choice.choice_index}`}
        id={`template-element-button-${elementIdAndIndex}`}
        onClick={handleClick}
        className={choice.class_name}
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
    if (blurredInput.value !== this.state.valueWhenInputFocused) {
      const { documentTranslationsAllInOne, initialValuesObject, elementName, documentLanguageCode, translationModeOn, eachElement } = this.props;
      // Code pre-template implementation
      const newEditHistoryItem = { before: { value: this.state.valueWhenInputFocused, name: blurredInput.name }, after: { value: blurredInput.value, name: blurredInput.name } }
      this.props.editHistory({ newEditHistoryItem, action: 'add' });
      // Code pre-template implementation
      // const splitValue = blurredInput.getAttribute('value').split('-');
      // const translationElement = splitValue[1] === 'translation';
      // const elementId = splitValue[splitValue.length - 1];
      // const templateElement = this.props.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements
      if (translationModeOn) {
        const valueInAllInONe = documentTranslationsAllInOne[elementName].translations[documentLanguageCode]
        const valueInInitialValues = initialValuesObject[`${elementName}+translation`]
        console.log('DocumentChoicesTemplate, handleOnBlur, elementName, blurredInput, blurredInput.value, documentTranslationsAllInOne, initialValuesObject, valueInAllInONe, valueInInitialValues', elementName, blurredInput, blurredInput.value, documentTranslationsAllInOne, initialValuesObject, valueInAllInONe, valueInInitialValues);
        // If after user exits out of the input field
        // and the value does not equal the standard translation
        // in the all in one object, assign a new document_field_translation
        // or update the value of the existing language_code
        let updateObject = null;
        if (blurredInput.value !== valueInAllInONe) {
          updateObject = { id: eachElement.id, translation_element: true, value: blurredInput.value, previous_value: this.state.valueWhenInputFocused };

          if (eachElement.document_field_translations) {
            updateObject.o_document_field_translations = eachElement.document_field_translations;
            updateObject.document_field_translations =  { ...eachElement.document_field_translations, [documentLanguageCode]: { id: null, value: blurredInput.value, language_code: documentLanguageCode, deleted: false } };
            // eachElement.document_field_translations[documentLanguageCode]
                                                        // ?
                                                        // { ...eachElement.document_field_translations, [documentLanguageCode], value: blurredInput.value, deleted: false }
                                                        // :
                                                        // { ...eachElement.document_field_translations, [documentLanguageCode]: { id: null, value: blurredInput.value, language_code: documentLanguageCode, deleted: false } };
          } else { // else of if (eachElement.document_field_translations) {
            // if the element does not have an exiting document_field_translation,
            // assign null to the old document_field_translation
            // and a new object for the language_code
            updateObject.o_document_field_translations = null;
            updateObject.addKey = 'document_field_translations';
            updateObject.document_field_translations = { [documentLanguageCode]: { value: blurredInput.value, language_code: documentLanguageCode, deleted: false } };
          }
        } else { // else of if (translationModeOn && blurredInput.value !== valueInAllInONe) {
          updateObject = { id: eachElement.id, translation_element: true, value: blurredInput.value, previous_value: this.state.valueWhenInputFocused };
          if (eachElement.document_field_translations) {
            updateObject.o_document_field_translations = eachElement.document_field_translations;
            updateObject.document_field_translations = eachElement.document_field_translations[documentLanguageCode]
                ?
                { ...eachElement.document_field_translations, [documentLanguageCode]: { ...eachElement.document_field_translations[documentLanguageCode], value: blurredInput.value, language_code: documentLanguageCode, deleted: true } }
                :
                { ...eachElement.document_field_translations };
          }
        } // end of if (translationModeOn && blurredInput.value !== valueInAllInONe) {

        console.log('DocumentChoicesTemplate, handleOnBlur, updateObject', updateObject);
        this.props.updateDocumentElementLocally([updateObject]);
        this.props.setTemplateHistoryArray([updateObject], 'update');
      } // if (translationModeOn) {
    } // end of if (blurredInput.value !== this.state.valueWhenInputFocused) {
  }

  handleOnFocus(event) {
    const focusedInput = event.target;
    const valueWhenInputFocused = event.target.value;
    this.setState({ focusedInput, valueWhenInputFocused }, () => {
    console.log('DocumentChoicesTemplate, handleOnFocus, this.state.focusedInput', this.state.focusedInput);
    });
  }

  createInputElement({ choice, meta, value, input, name }) {
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    const idName = !this.props.translationModeOn ? 'template-element' : 'template-translation-element'
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
        id={this.props.editTemplate ? `${idName}-input-${choice.element_id}` : 'valueTextarea'}
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

  renderSelectOptions(choice, name) {
    const emptyChoice = { value: '', en: '', jp: '', po: '' };
    // choice is mapped to a model in ../constant/
    const selectChoices = choice.selectChoices || choice.select_choices;
    // gets base language of document from ../constant/documents
    // const documentBaseLanguage = Documents[this.props.documentKey].baseLanguage;
    const documentBaseLanguage = this.props.agreement.language_code;
    // assign the document base language, otherwise, use documentLanguageCode
    const language = !choice.translation ? documentBaseLanguage : this.props.documentLanguageCode;
    // const language = choice.baseLanguageField ? documentBaseLanguage : this.props.documentLanguageCode;

    const getTranslation = (choices, value) => {
      let returnObject = null;
      let modifiedValue = value;
      if (value === 't') modifiedValue = true;
      if (value === 'f') modifiedValue = false;
      if (choices[modifiedValue]) returnObject = choices[modifiedValue].translation;
      if (choices.inputFieldValue && choices.inputFieldValue.selectChoices) {
        returnObject = choices.inputFieldValue.selectChoices[modifiedValue]
      }

      console.log('DocumentChoicesTemplate, renderSelectOptions, name, choices, value, returnObject', name, choices, value, returnObject);
      return returnObject;
    }; // end of getTranslation

    let translationObject = null;
    const elementObject = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey][name];

    selectChoices[10] = emptyChoice;
    let value = null;
    let text = null;
    // return <option key={i} value={value}>{choice.showLocalLanguage ? eachChoice[language] : eachChoice.value}</option>;
    return _.map(selectChoices, (eachChoice, i) => {
      // Test whether value is false to deal with true or false values e.g. parking_included
      value = (eachChoice.value === false || eachChoice.value === 'f') ? eachChoice.value : (eachChoice.value || eachChoice.val);

      if (elementObject) {
        translationObject = getTranslation(elementObject.choices, value);
        // console.log('DocumentChoicesTemplate, renderSelectOptions, name, eachChoice, text, value, language, elementObject, translationObject', name, eachChoice, text, value, language, elementObject, translationObject);
        // console.log('DocumentChoicesTemplate, renderSelectOptions, name, eachChoice, text, value, language, elementObject, translationObject', name, eachChoice, text, value, language, elementObject, translationObject);
        // console.log('DocumentChoicesTemplate, renderSelectOptions, name, eachChoice, text, value, language, elementObject, Object.keys(elementObject.choices), typeof Object.keys(elementObject.choices)[0]', name, eachChoice, text, value, language, elementObject, Object.keys(elementObject.choices), typeof Object.keys(elementObject.choices)[0]);
        console.log('DocumentChoicesTemplate, renderSelectOptions, name, eachChoice, text, value, translationObject', name, eachChoice, text, value, translationObject);
      }
      // text = eachChoice.translation ? eachChoice.translation[language] : eachChoice[language];
      text = translationObject ? translationObject[language] : value;
      // if (value === 't') value = true;
      // if (value === 'f') value = false;
      // text = typeof text === 'boolean' ? object[text] : text;
      return <option key={i} value={value}>{text}</option>;
      // return <option key={i} value={value}>{text || value}</option>;
    });
  }

  createSelectElement({ choice, meta, name, value, input }) {
    const elementIdAndIndex = `${choice.element_id},${choice.choice_index}`
    let valueSwitch = null;
    // Value prop changes when user selects editFieldsOn;
    // Value props is used for drag elements
    if (this.props.editFieldsOn) {
      valueSwitch = elementIdAndIndex;
    } else {
      valueSwitch = (this.props.otherChoiceValues.indexOf(value.toString().toLowerCase()) !== -1) ? '' : value;
    }
    console.log('DocumentChoicesTemplate, createSelectElement, choice, value, this.props.otherChoiceValues: ', choice, value, this.props.otherChoiceValues);
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    return (
        <select
          {...input}
          // value={this.props.otherChoiceValues.includes(value.toString().toLowerCase()) ? '' : value}
          // value={(this.props.otherChoiceValues.indexOf(value.toString().toLowerCase()) !== -1) ? '' : value}
          value={valueSwitch}
          // id="valueInput"
          id={`template-element-button-${elementIdAndIndex}`}
          // name={elementIdAndIndex}
          maxLength={this.props.charLimit}
          key={choice.val}
          onChange={this.handleInputChange}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
          type={choice.input_type}
          className={choice.class_name}
          style={this.getStyleOfInputElement(value, choice)}
        >
        {this.renderSelectOptions(choice, name)}
        </select>
    );
  }

  createTextareaElement({ choice, value, input }) {
    console.log('DocumentChoicesTemplate, createTextareaElement choice, value, input', choice, value, input);
    // const dirtyValue = this.state.inputValue || (meta.dirty ? this.state.inputValue : value);
    // Set idname for getElementById in element move and resize
    const idName = !this.props.translationModeOn ? 'template-element' : 'template-translation-element'

    return (
        <textarea
          {...input}
          id={this.props.editTemplate ? `${idName}-input-${choice.element_id}` : 'valueTextarea'}
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
          style={this.getStyleOfInputElement(value, choice)}
        />
    );
  }

  renderEachChoice(choices) {
    const { input: { value, onChange, name, onBlur }, meta, input } = this.props;
    console.log('DocumentChoicesTemplate, renderEachChoice name, value, input, this.props, choices: ', name, value, input, this.props, choices)
    // Field has choices in document_form object; iterate through choices
    // For some reason, cannot destructure page from this.props!!!!!!
    // reference : https://redux-form.com/6.0.0-rc.3/docs/api/field.md/#props
    let selectElement = null;
    return _.map(choices, choice => {
      // value is value passed from Field and needs to be specified for initialValues
      // this.anyOfOtherValues checks if any of the other choice.val matches value,
      // if so do not use as value, use ''
      // if choice type is string, use input element above and button if not string
      if ((choice.input_type == 'string' || choice.input_type == 'date') && (!choice.selectChoices && !choice.select_choices)) {
        // define input element for user to input
        const inputElement = this.createInputElement({ choice, meta, value, onBlur, name, input: this.props.input })
        return inputElement;
      } else if (choice.input_type == 'text')  {
        const textareaElement = this.createTextareaElement({ choice, meta, value, input: this.props.input })
        return textareaElement;
      } else if (choice.selectChoices || choice.select_choices) {
        if (this.props.editFieldsOn) {
          selectElement = this.createButtonElement({ choice, meta, value, input: this.props.input });
        } else {
          selectElement = this.createSelectElement({ choice, meta, value, name, input: this.props.input });
        }
        return selectElement;
      } else {
        const buttonElement = this.createButtonElement({ name, choice, onChange, meta, value, input: this.props.input })
        return buttonElement;
      }
    });
  }

  render() {
    // IMPORTANT: In template elements, got rid of params in choices: { 0: { params: {}}};
    // it is just choices: { attributes }
    // destructure local props set by redux forms Field compoenent
    const { input: { name } } = this.props;
    let choices = null;
    let element = null;
    // console.log('in document_choices_template, render, name, this.props.elementName, this.props.formFields, this.props.formFields[this.props.page][this.props.elementId].document_field_choices: ', name, this.props.elementName, this.props.formFields, this.props.formFields[this.props.page][this.props.elementId].document_field_choices);
    // if (this.props.editTemplate) {
    if (this.props.editFieldsOn) {
      choices = this.props.formFields[this.props.page][this.props.elementId].choices;
      if (this.props.translationModeOn && !this.props.eachElement.translation_element) {
        // if (this.props.eachElement.translation_element)
        element = this.props.formFields[this.props.page][this.props.elementId];
        choices = element.document_field_choices ? this.props.formFields[this.props.page][this.props.elementId].document_field_choices : { 0: { ...element, val: 'inputFieldValue', choice_index: 0, element_id: element.id, position: 'absolute' } };
      }
    } else {
      element = this.props.formFields[this.props.page][this.props.elementId];
      choices = element.document_field_choices ? element.document_field_choices : { 0: { ...element, val: 'inputFieldValue', choice_index: 0, element_id: element.id, position: 'absolute' } };
    }
    // {this.renderEachChoice(this.props.formFields[this.props.page][this.props.elementId].choices)}
    if (this.props.editFieldsOn) {
      if (this.props.translationModeOn && !this.props.eachElement.translation_element) {
        console.log('in document_choices_template, render, name, this.props.eachElement, this.props.formFields[this.props.page], this.props, this.props.translationModeOn, this.props.editFieldsOn, choices: ', name, this.props.eachElement, this.props.formFields, this.props, this.props.translationModeOn, this.props.editFieldsOn, choices);
        return (
          <div key={name}>
            {this.renderEachChoice(choices)}
          </div>
        );
      }
      return (
        <div
          key={name}
          style={{
              // wrapping div fits the outer div to house inputs and buttons
              width: '100%',
              // height: '100%',
              height: this.props.inputElement ? this.props.innerDivPercentageOfWrapper : '100%',
              position: this.props.editFieldsOn ? 'relative' : ''
              // height: `${this.props.wrappingDivDocumentCreateH * 100}%`
            }}
        >
          {this.renderEachChoice(choices)}
          {this.props.editFieldsOn ? <div style={{ position: 'absolute', top: '-16px', left: '5px', fontSize: '11px', color: 'lightgray', display: 'table', width: '220px', textAlign: 'left' }}>{this.props.label}</div> : ''}
        </div>
      );
    }

    return (
      <div key={name}>
        {this.renderEachChoice(choices)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in document_choices_template, mapStateToProps, state: ', state);
  // console.log('in document_choices_template, mapStateToProps: ');
  return {
    allValues: state.form && state.form.CreateEditDocument ? state.form.CreateEditDocument.values : {},
    registeredFields: state.form && state.form.CreateEditDocument ? state.form.CreateEditDocument.registeredFields : {},
    documentLanguageCode: state.languages.documentLanguageCode,
    editHistoryProp: state.documents.editHistory,
    dirtyFields: state.documents.dirtyObject,
    appLanguageCode: state.languages.appLanguageCode,
    allDocumentObjects: state.documents.allDocumentObjects,
    documentTranslationsAllInOne: state.documents.documentTranslationsAllInOne,
    initialValuesObject: state.form && state.form.CreateEditDocument ? state.form.CreateEditDocument.initial : {},
  };
}

export default connect(mapStateToProps, actions)(DocumentChoicesTemplate);
