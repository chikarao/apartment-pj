import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// import {
//   // reduxForm,
//   // Field,
//   // isDirty,
//   // getFormMeta,
//   change
// } from 'redux-form';

import * as actions from '../../actions';
import getElementLabel from '../functions/get_element_label';
import getElementValueText from '../functions/get_element_value_text';
import Documents from '../constants/documents';
import AppLanguages from '../constants/app_languages';

class GetFieldValueChoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applySelectedDocumentValueCompleted: false,
      showAllSelectedValues: false,
      customFieldModeOn: false,
      selectedCustomFieldChoice: null,
      showCustomFieldValues: false
    };

    this.handleFieldCheckboxClick = this.handleFieldCheckboxClick.bind(this);
    this.handleFieldValueApplyClick = this.handleFieldValueApplyClick.bind(this);
    this.handleCustomFieldChoiceClick = this.handleCustomFieldChoiceClick.bind(this);
  }

  handleFieldCheckboxClick(event) {
    const { fieldValueDocumentObject } = this.props;
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    const newArray = [...this.props.fieldValueDocumentObject.selectedFieldNameArray];
    let index = 0;
    let valuesAlreadyApplied = false;

    if (elementVal === 'checkAll' || elementVal === 'unCheckAll') {
      // go through each fieldValueDocumentObject set by action setGetFieldValueDocumentObject
      // called in SelectExitingDocumentModal
      _.each(Object.keys(fieldValueDocumentObject.fieldObject), eachKey => {
        index = newArray.indexOf(eachKey);
        valuesAlreadyApplied = this.props.fieldValueDocumentObject.fieldValueAppliedArray.indexOf(eachKey) !== -1;
        // push in to array if not already there or if value has not already been applied
        if (elementVal === 'checkAll') {
          if (index === -1 && !valuesAlreadyApplied && !fieldValueDocumentObject.fieldObject[eachKey].sameValues) {
            // push into newArray
            newArray.push(eachKey);
          }
        } else if (index !== -1) { // if (elementVal === 'checkAll') {
          newArray.splice(index, 1);
        }
      });
    } else { //  if (elementVal === 'checkAll' || elementVal === 'unCheckAll')
      // remove or add names by single user click
      index = this.props.fieldValueDocumentObject.selectedFieldNameArray.indexOf(elementVal);
      if (index === -1) {
        newArray.push(elementVal);
      } else {
        newArray.splice(index, 1);
      }
    }

    this.props.setGetFieldValueDocumentObject({ ...this.props.fieldValueDocumentObject, selectedFieldNameArray: newArray });
  }

  handleCustomFieldChoiceClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.setState({ selectedCustomFieldChoice: elementVal }, () => {
      console.log('in GetFieldValueChoiceModal, handleCustomFieldChoiceClick, elementVal, this.state.selectedCustomFieldChoice: ', elementVal, this.state.selectedCustomFieldChoice);
    });
  }

  renderCustomFields() {
    return _.map(Object.keys(this.props.selectedFieldObject.fields), (eachFieldKey, i) => {
      // console.log('in GetFieldValueChoiceModal, renderCustomFields, this.props.selectedFieldObject, eachFieldKey, this.props.selectedFieldObject.fields[eachFieldKey]: ', this.props.selectedFieldObject, eachFieldKey, this.props.selectedFieldObject.fields[eachFieldKey]);
      if (this.props.selectedFieldObject.fields[eachFieldKey].customField) {
        return (
          <li
            key={i}
            className="get-field-value-choice-modal-values-each"
            value={eachFieldKey}
            onClick={this.handleCustomFieldChoiceClick}
          >
            <div className="get-field-value-choice-modal-values-each-text-box" value={eachFieldKey}>
              <div className="get-field-value-choice-modal-values-each-text-box-key" value={eachFieldKey}>
                {this.props.selectedFieldObject.fields[eachFieldKey].element.custom_name}
              </div>
              <div className="get-field-value-choice-modal-values-each-text-box-value" value={eachFieldKey}>
                Link to DB: {this.props.selectedFieldObject.fields[eachFieldKey].element.name
                              ?
                              this.props.selectedFieldObject.fields[eachFieldKey].element.name
                              :
                              'None'}
              </div>
            </div>
          </li>
        );
      }
    });
  }

  renderEachValue() {
    let elementName = '';
    let elementValueText = '';
    let changeApplied = false;
    const allObject = this.props.fieldValueDocumentObject ? this.props.allDocumentObjects[Documents[this.props.fieldValueDocumentObject.agreement.template_file_name].propsAllKey] : {};
    console.log('in GetFieldValueChoiceModal, renderEachValue, this.props.fieldValueDocumentObject, this.props.allDocumentObjects, allObject: ', this.props.fieldValueDocumentObject, this.props.allDocumentObjects, allObject);

    const renderEach = (eachFieldObject, i) => {
      elementName = eachFieldObject.field.custom_name
                    ?
                    eachFieldObject.field.custom_name
                    :
                    getElementLabel({
                      allDocumentObjects: this.props.allDocumentObjects,
                      documents: Documents,
                      agreement: this.props.fieldValueDocumentObject.agreement,
                      modifiedElement: eachFieldObject,
                      fieldName: eachFieldObject.fieldName,
                      documentTranslationsAll: this.props.documentTranslationsAll,
                      appLanguages: AppLanguages,
                      appLanguageCode: this.props.appLanguageCode,
                      fromCreateEditDocument: false,
                      // translationModeOn: false
                    });

      const getElementValue = () => getElementValueText({
        allDocumentObjects: this.props.allDocumentObjects,
        documents: Documents,
        agreement: this.props.fieldValueDocumentObject.agreement,
        eachFieldObject,
        // fieldName: eachFieldObject.fieldName,
        // documentTranslationsAll: this.props.documentTranslationsAll,
        appLanguages: AppLanguages,
        appLanguageCode: this.props.appLanguageCode,
        fromCreateEditDocument: false,
        documentConstants: this.props.documentConstants,
        fieldValue: eachFieldObject[eachFieldObject.fieldName]
      });
      // Test if change for field as already been applied
      changeApplied = this.props.fieldValueDocumentObject.fieldValueAppliedArray.indexOf(eachFieldObject.fieldName) !== -1;
      let value = null;
      if (eachFieldObject.field.custom_name) {
        value = eachFieldObject.currentValue;
      } else {
        value = !eachFieldObject.field.document_field_choices ? eachFieldObject[eachFieldObject.fieldName] : getElementValue()
      }

      return (
        <li key={i} className="get-field-value-choice-modal-values-each">
          <div className="get-field-value-choice-modal-values-each-text-box">
            <div className="get-field-value-choice-modal-values-each-text-box-key">
              {elementName} &nbsp;
              {changeApplied
              ?
              <i style={{ color: ' #33a532', fontSize: '16px' }} className="fas fa-check-circle"></i>
              :
              ''}
            </div>
            <div className="get-field-value-choice-modal-values-each-text-box-value">
              {value}
            </div>
          </div>
          <div className="get-field-value-choice-modal-values-each-checkbox-box">
            {!changeApplied && (!eachFieldObject.sameValues)
              ?
              <input
                className="get-field-value-choice-modal-values-each-checkbox-box-input"
                type="checkbox"
                onChange={this.handleFieldCheckboxClick}
                value={eachFieldObject.fieldName}
                checked={this.props.fieldValueDocumentObject.selectedFieldNameArray.indexOf(eachFieldObject.fieldName) !== -1}
              />
              :
              ''
            }
          </div>
        </li>
      );
    };

    let renderFieldObject = false;
    // go through each fieldValueDocumentObject set by action setGetFieldValueDocumentObject
    // called in SelectExitingDocumentModal
    return _.map(this.props.fieldValueDocumentObject.fieldObject, (eachFieldObject, i) => {
      console.log('in GetFieldValueChoiceModal, renderEachValue, this.props.fieldValueDocumentObject, eachFieldObject, this.props.selectedFieldObject, allObject: ', this.props.fieldValueDocumentObject, eachFieldObject, this.props.selectedFieldObject, allObject);
      renderFieldObject = false;
      // getElementLabel function is shared with CreateEditDocument renderTemplateElements
      // sameValues attribute compares currentValue in form value props
      //and value attribute in documentField for document
      if (!this.state.customFieldModeOn
          && this.state.showAllSelectedValues
          && this.props.selectedFieldObject.fields[eachFieldObject.fieldName]
        ) {
        // return renderEach(eachFieldObject, i);
        renderFieldObject = true;
      } else if (!this.state.customFieldModeOn && (!eachFieldObject.sameValues)) {
        // return renderEach(eachFieldObject, i);
        renderFieldObject = true;
      } else if (this.state.customFieldModeOn && !this.state.showCustomFieldValues) {
        // return renderEach(eachFieldObject, i);
        renderFieldObject = true;
      } else if (this.state.customFieldModeOn && this.state.showCustomFieldValues && eachFieldObject.customName) {
        renderFieldObject = true;
      }

      if (renderFieldObject) return renderEach(eachFieldObject, i);
    });
  }

  handleFieldValueApplyClick() {
    let valueInSelectedDocument = null;
    let templateElement = null;
    const updateArray = [];
    let updateObject = null;
    const newArray = [...this.props.fieldValueDocumentObject.fieldValueAppliedArray];

    _.each(this.props.fieldValueDocumentObject.selectedFieldNameArray, eachName => {
      valueInSelectedDocument = this.props.fieldValueDocumentObject.fieldObject[eachName][eachName];
      templateElement = this.props.selectedFieldObject.fields[eachName].element
      console.log('in GetFieldValueChoiceModal, handleFieldValueApplyClick,eachName, valueInSelectedDocument, templateElement, this.props.changeFormValue: ', eachName, valueInSelectedDocument, templateElement, this.props.changeFormValue);
      // Array for state fieldValueAppliedArray
      newArray.push(eachName);
      // Object and updateArray for applySelectedDocumentValueCompleted
      updateObject = { id: templateElement.id, value: valueInSelectedDocument, previous_value: this.props.fieldValueDocumentObject.fieldObject[eachName].currentValue };
      updateArray.push(updateObject);
      // Calling this.props.change for reduxForm
      this.props.changeFormValue(eachName, valueInSelectedDocument);
    });

    this.props.setGetFieldValueDocumentObject({ ...this.props.fieldValueDocumentObject, selectedFieldNameArray: [], fieldValueAppliedArray: newArray });
    console.log('in GetFieldValueChoiceModal, handleFieldValueApplyClick, updateArray: ', updateArray);
       // Apply changes in value to templateElements and in localStorageHistory
    this.props.updateDocumentElementLocallyAndSetHistory(updateArray);
  }

  renderButtons() {
    // console.log('in GetFieldValueChoiceModal, renderButtons, this.props.fieldValueDocumentObject: ', this.props.fieldValueDocumentObject);
    const checkedAll = this.props.fieldValueDocumentObject.selectedFieldNameArray.length === this.props.fieldValueDocumentObject.differentValueCount;
    const diferentValuesExist = this.props.fieldValueDocumentObject.differentValueCount > 0;
    const checkedSome = this.props.fieldValueDocumentObject.selectedFieldNameArray.length > 0;
    const allValuesAlreadyApplied = this.props.fieldValueDocumentObject.fieldValueAppliedArray.length === this.props.fieldValueDocumentObject.differentValueCount;
    let disableCheckAll = false;
    if (diferentValuesExist && (checkedAll || allValuesAlreadyApplied)) disableCheckAll = true;
    if (!diferentValuesExist) disableCheckAll = true;

    return (
      <div className="get-field-value-choice-modal-button-box">
        <div className="get-field-value-choice-modal-button-checkall-box"
          style={{ width: this.props.selectedFieldObject.customFieldExists ? '90%' : null }}
        >
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: disableCheckAll ? 'gray' : 'blue' }}
            // style={{ color: checkedAll || allValuesAlreadyApplied ? 'gray' : 'blue' }}
            value="checkAll"
            // onClick={checkedAll || allValuesAlreadyApplied ? () => {} : this.handleFieldCheckboxClick}
            onClick={disableCheckAll ? () => {} : this.handleFieldCheckboxClick}
          >
            Check All
          </div>
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: checkedSome && !allValuesAlreadyApplied ? 'blue' : 'gray'}}
            value="unCheckAll"
            onClick={checkedSome ? this.handleFieldCheckboxClick : () => {}}
          >
            Uncheck All
          </div>
          {
            this.props.selectedFieldObject.customFieldExists
            ?
            <div
              className="get-field-value-choice-modal-button-custom-standard"
              onClick={() => this.setState({ customFieldModeOn: !this.state.customFieldModeOn })}
            >
              {this.state.customFieldModeOn ? 'Standard Fields' : 'Custom Fields'}
            </div>
            :
            null
          }
        </div>
        <div
          className={checkedSome && !allValuesAlreadyApplied ? 'get-field-value-choice-modal-button-apply button-hover' : 'get-field-value-choice-modal-button-apply'}
          onClick={checkedSome && !allValuesAlreadyApplied ? this.handleFieldValueApplyClick : () => {}}
          style={checkedSome && !allValuesAlreadyApplied ? {} : { border: '1px solid #ccc', backgroundColor: 'lightgray' }}
        >
          Apply Field Values
        </div>
      </div>
    );
  }

  renderMainModal() {
    return (
      <div
        className="get-field-value-choice-modal-main"
        id="get-field-value-choice-modal-main"
        style={{ top: this.props.top, left: this.props.left }}
      >
        {
          this.props.selectedFieldObject.customFieldExists && this.state.customFieldModeOn
          ?
          <div className="get-field-value-choice-modal-category-heading"> Custom Fields</div>
          :
          <div className="get-field-value-choice-modal-title">{`Available ${this.props.getDataBaseValues ? 'Data Base' : ''} Values`}</div>
        }
        { this.state.customFieldModeOn
          ?
          <ul className="get-field-value-choice-modal-custom-scrollbox">
            {this.renderCustomFields()}
          </ul>
          :
          null
        }
        {
          this.props.selectedFieldObject.customFieldExists && this.state.customFieldModeOn
          ?
          <div className="get-field-value-choice-modal-category-heading">Available Values</div>
          :
          null
        }
        <ul className={`get-field-value-choice-modal-scrollbox ${this.state.customFieldModeOn ? 'get-field-value-choice-modal-scrollbox-small' : ''}`}>
          {this.props.fieldValueDocumentObject && Object.keys(this.props.fieldValueDocumentObject.fieldObject).length > 0 ? this.renderEachValue() : <div style={{ padding: '20px' }}>There are no values available for update from this document for the fields selected</div>}
        </ul>
          <div className="get-field-value-choice-modal-hide-same-values-input-box">
            <div className="get-field-value-choice-modal-hide-same-values-text">
              {!this.state.customFieldModeOn ? 'Show All Selected Values' : 'Show Custom Field Values'}
            </div>
            <input
              className="get-field-value-choice-modal-hide-same-values-input"
              type="checkbox"
              onChange={!this.state.customFieldModeOn ? () => this.setState({ showAllSelectedValues: !this.state.showAllSelectedValues }) : () => this.setState({ showCustomFieldValues: !this.state.showCustomFieldValues })}
              checked={!this.state.customFieldModeOn ? this.state.showAllSelectedValues : this.state.showCustomFieldValues}
            />
          </div>
        {this.props.fieldValueDocumentObject ? this.renderButtons() : null}
      </div>
    );
  }

  // renderCustomFieldSubModal() {
  //   return (
  //     <div
  //       className="get-field-value-choice-modal-main-sub"
  //     >
  //       SUB
  //     </div>
  //   )
  // }

  render() {
    // {this.renderCustomFieldSubModal()}
    return(
      <div>
        {this.renderMainModal()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('in GetFieldValueChoiceModal, mapStateToProps, state: ', state);

  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    fieldValueDocumentObject: state.documents.fieldValueDocumentObject,
    allDocumentObjects: state.documents.allDocumentObjects,
    documentTranslationsAll: state.documents.documentTranslations,
    appLanguageCode: state.languages.appLanguageCode,
    selectedFieldObject: state.documents.selectedFieldObject,
    allDocumentObjects: state.documents.allDocumentObjects,
    documentConstants: state.documents.documentConstants,
    valuesInForm: state.form.CreateEditDocument && state.form.CreateEditDocument.values ? state.form.CreateEditDocument.values : {},
    // flat: state.selectedFlatFromParams.selectedFlatFromParams,
  };
}


export default connect(mapStateToProps, actions)(GetFieldValueChoiceModal);


  // Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
