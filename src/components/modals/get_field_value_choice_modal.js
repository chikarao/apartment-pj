import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import getElementLabel from '../functions/get_element_label';
import Documents from '../constants/documents';
import AppLanguages from '../constants/app_languages';

class GetFieldValueChoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFieldNameArray: [],
      applySelectedDocumentValueCompleted: false,
      fieldValueAppliedArray: [],
      hideSameValues: false
      // deleteBankAccountCompleted: false,
    };

    this.handleFieldCheckboxClick = this.handleFieldCheckboxClick.bind(this);
    this.handleFieldValueApplyClick = this.handleFieldValueApplyClick.bind(this);
  }

  handleFieldCheckboxClick(event) {
    const { fieldValueDocumentObject } = this.props;
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    const newArray = [...this.state.selectedFieldNameArray];
    let index = 0;
    let valuesAlreadyApplied = false;

    if (elementVal === 'checkAll' || elementVal === 'unCheckAll') {
      // go through each fieldValueDocumentObject set by action setGetFieldValueDocumentObject
      // called in SelectExitingDocumentModal
      _.each(Object.keys(fieldValueDocumentObject.fieldObject), eachKey => {
        index = newArray.indexOf(eachKey);
        valuesAlreadyApplied = this.state.fieldValueAppliedArray.indexOf(eachKey) !== -1;
        // push in to array if not already there or if value has not already been applied
        if (elementVal === 'checkAll') {
          if (index === -1 && !valuesAlreadyApplied) {
            // push into newArray
            newArray.push(eachKey);
          }
        } else { // if (elementVal === 'checkAll') {
          newArray.splice(index, 1);
        }
      });
    } else { //  if (elementVal === 'checkAll' || elementVal === 'unCheckAll')
      // remove or add names by single user click
      index = this.state.selectedFieldNameArray.indexOf(elementVal);
      if (index === -1) {
        newArray.push(elementVal);
      } else {
        newArray.splice(index, 1);
      }
    }

    this.setState({
      selectedFieldNameArray: newArray,
      // fieldValueAppliedArray: []
    }, () => {
      console.log('in GetFieldValueChoiceModal, handleFieldCheckboxClick, elementVal, this.state.selectedFieldNameArray: ', elementVal, this.state.selectedFieldNameArray);
    });
  }


  renderEachValue() {
    let elementName = '';
    let changeApplied = false;
    // go through each fieldValueDocumentObject set by action setGetFieldValueDocumentObject
    // called in SelectExitingDocumentModal
    return _.map(this.props.fieldValueDocumentObject.fieldObject, (eachFieldObject, i) => {
      console.log('in GetFieldValueChoiceModal, renderEachValue, eachFieldObject: ', eachFieldObject);
      // getElementLabel function is shared with CreateEditDocument renderTemplateElements
      elementName = getElementLabel({
        allDocumentObjects: this.props.allDocumentObjects,
        documents: Documents,
        agreement: this.props.fieldValueDocumentObject.agreement,
        modifiedElement: eachFieldObject,
        fieldName: eachFieldObject.fieldName,
        documentTranslationsAll: this.props.documentTranslationsAll,
        appLanguages: AppLanguages,
        appLanguageCode: this.props.appLanguageCode,
        fromCreateEditDocument: false
      });
      // Test if change for field as already been applied
      changeApplied = this.state.fieldValueAppliedArray.indexOf(eachFieldObject.fieldName) !== -1;

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
              {eachFieldObject[eachFieldObject.fieldName]}
            </div>
          </div>
          <div className="get-field-value-choice-modal-values-each-checkbox-box">
            {!changeApplied
              ?
              <input
                className="get-field-value-choice-modal-values-each-checkbox-box-input"
                type="checkbox"
                onChange={this.handleFieldCheckboxClick}
                value={eachFieldObject.fieldName}
                checked={this.state.selectedFieldNameArray.indexOf(eachFieldObject.fieldName) !== -1}
              />
              :
              ''
            }
          </div>
        </li>
      );
    });
  }

  handleFieldValueApplyClick() {
    let valueInSelectedDocument = null;
    let templateElement = null;
    const array = [];
    let updateObject = null;
    const newArray = [...this.state.fieldValueAppliedArray];

    _.each(this.state.selectedFieldNameArray, eachName => {
      valueInSelectedDocument = this.props.fieldValueDocumentObject.fieldObject[eachName][eachName];
      templateElement = this.props.selectedFieldObject[eachName].element
      // this.props.change(eachName, valueInSelectedDocument);
      console.log('in GetFieldValueChoiceModal, handleFieldValueApplyClick,valueInSelectedDocument, templateElement: ', valueInSelectedDocument, templateElement);
      newArray.push(eachName);
      updateObject = { id: templateElement.id, value: valueInSelectedDocument, previous_value: this.props.fieldValueDocumentObject.fieldObject[eachName].currentValue };
      array.push(updateObject);
    });

    this.setState({
      // applySelectedDocumentValueCompleted: true,
      selectedFieldNameArray: [],
      fieldValueAppliedArray: newArray
     }, () => {
       // this.props.updateDocumentElementLocallyAndSetHistory(array)
      console.log('in GetFieldValueChoiceModal, handleFieldValueApplyClick, array: ', array);
      // setTimeout(() => {
      //   this.setState({ applySelectedDocumentValueCompleted: false }, () => {
      //     console.log('in GetFieldValueChoiceModal, handleFieldValueApplyClick, this.state.applySelectedDocumentValueCompleted: ', this.state.applySelectedDocumentValueCompleted);
      //   });
      // }, 3000);
    }); // end of first setState
  }

  renderButtons() {
    const checkedAll = this.state.selectedFieldNameArray.length === Object.keys(this.props.fieldValueDocumentObject.fieldObject).length;
    const checkedSome = this.state.selectedFieldNameArray.length > 0;
    const allValuesAlreadyApplied = this.state.fieldValueAppliedArray.length === Object.keys(this.props.fieldValueDocumentObject.fieldObject).length;
    return (
      <div className="get-field-value-choice-modal-button-box">
        <div className="get-field-value-choice-modal-button-checkall-box">
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: checkedAll || allValuesAlreadyApplied ? 'gray' : 'blue' }}
            value="checkAll"
            onClick={checkedAll || allValuesAlreadyApplied ? () => {} : this.handleFieldCheckboxClick}
          >
            Check All
          </div>
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: checkedSome && !allValuesAlreadyApplied ? 'blue' : 'gray' }}
            value="unCheckAll"
            onClick={checkedSome ? this.handleFieldCheckboxClick : () => {}}
          >
            Uncheck All
          </div>
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

  render() {
    // {this.state.applySelectedDocumentValueCompleted
    //   ?
    //   <div className="get-field-value-choice-modal-title-applied-message">Values Applied</div>
    //   :
    //   null
    // }
    // <div className="get-field-value-choice-modal-hide-same-values-input-box">
    // <input
    // className="get-field-value-choice-modal-hide-same-values-input"
    // type="checkbox"
    // onChange={() => this.setState({ hideSameValues: !this.state.hideSameValues })}
    // checked={this.state.hideSameValues}
    // />
    // </div>
    return (
      <div
        className="get-field-value-choice-modal-main"
        id="get-field-value-choice-modal-main"
        style={{ top: this.props.top, left: this.props.left }}
      >
        <div className="get-field-value-choice-modal-title">Available Values</div>
        <ul className="get-field-value-choice-modal-scrollbox">
          {Object.keys(this.props.fieldValueDocumentObject.fieldObject).length > 0 ? this.renderEachValue() : <div style={{ padding: '20px' }}>There are no values available from this document for the fields selected</div>}
        </ul>
          {this.renderButtons()}
      </div>
    );
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
    // flat: state.selectedFlatFromParams.selectedFlatFromParams,
  };
}


export default connect(mapStateToProps, actions)(GetFieldValueChoiceModal);


  // Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
