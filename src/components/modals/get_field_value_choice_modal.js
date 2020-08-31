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
      // deleteBankAccountCompleted: false,
    };

    this.handleFieldCheckboxClick = this.handleFieldCheckboxClick.bind(this);
    this.handleFieldValueApplyClick = this.handleFieldValueApplyClick.bind(this);
  }

  handleFieldCheckboxClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    const newArray = [...this.state.selectedFieldNameArray];

    if (elementVal === 'checkAll' || elementVal === 'unCheckAll') {

      _.each(this.props.fieldValueDocumentObject.array, eachObject => {
        const index = newArray.indexOf(eachObject.fieldName);
        if (elementVal === 'checkAll') {
          if (index === -1) {
            // push into newArray
            newArray.push(eachObject.fieldName);
          }
        } else { // if (elementVal === 'checkAll') {
          newArray.splice(index, 1);
        }
      });
    } else { //  if (elementVal === 'checkAll' || elementVal === 'unCheckAll')
      const index = this.state.selectedFieldNameArray.indexOf(elementVal);
      if (index === -1) {
        newArray.push(elementVal);
      } else {
        newArray.splice(index, 1);
      }

    }

    this.setState({ selectedFieldNameArray: newArray }, () => {
      console.log('in GetFieldValueChoiceModal, handleFieldCheckboxClick, elementVal, this.state.selectedFieldNameArray: ', elementVal, this.state.selectedFieldNameArray);
    });
  }


  renderEachValue() {
    let elementName = ''
    return _.map(this.props.fieldValueDocumentObject.array, (eachFieldObject, i) => {
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

      return (
        <li key={i} className="get-field-value-choice-modal-values-each">
          <div className="get-field-value-choice-modal-values-each-text-box">
            <div className="get-field-value-choice-modal-values-each-text-box-key">
              {elementName}
            </div>
            <div className="get-field-value-choice-modal-values-each-text-box-value">
              {eachFieldObject[eachFieldObject.fieldName]}
            </div>
          </div>
          <div className="get-field-value-choice-modal-values-each-checkbox-box">
            <input
              className="get-field-value-choice-modal-values-each-checkbox-box-input"
              type="checkbox"
              onChange={this.handleFieldCheckboxClick}
              value={eachFieldObject.fieldName}
              checked={this.state.selectedFieldNameArray.indexOf(eachFieldObject.fieldName) !== -1}
            />
          </div>
        </li>
      );
    });
  }

  handleFieldValueApplyClick() {

  }

  renderButtons() {
    const checkedAll = this.state.selectedFieldNameArray.length === this.props.fieldValueDocumentObject.array.length;
    const checkedSome = this.state.selectedFieldNameArray.length > 0;
    return (
      <div className="get-field-value-choice-modal-button-box">
        <div className="get-field-value-choice-modal-button-checkall-box">
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: checkedAll ? 'gray' : 'blue' }}
            value="checkAll"
            onClick={checkedAll ? () => {} : this.handleFieldCheckboxClick}
          >
            Check All
          </div>
          <div
            className="get-field-value-choice-modal-button-checkall-each"
            style={{ color: checkedSome ? 'blue' : 'gray' }}
            value="unCheckAll"
            onClick={checkedSome ? this.handleFieldCheckboxClick : () => {}}
          >
            Uncheck All
          </div>
        </div>
        <div
          className={checkedSome ? 'get-field-value-choice-modal-button-apply button-hover' : 'get-field-value-choice-modal-button-apply'}
          onClick={checkedSome ? this.handleFieldValueApplyClick : () => {}}
          style={checkedSome ? {} : { border: '1px solid #ccc', backgroundColor: 'lightgray' }}
        >
          Apply Field Values
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className="get-field-value-choice-modal-main"
        id="get-field-value-choice-modal-main"
        style={{ top: this.props.top, left: this.props.left }}
      >
        <div className="get-field-value-choice-modal-title">Available Values</div>
        <ul className="get-field-value-choice-modal-scrollbox">
          {this.props.fieldValueDocumentObject.array.length > 0 ? this.renderEachValue() : <div style={{ padding: '20px' }}>There are no values available from this document for the fields selected</div>}
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
    // flat: state.selectedFlatFromParams.selectedFlatFromParams,
  };
}


export default connect(mapStateToProps, actions)(GetFieldValueChoiceModal);


  // Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
