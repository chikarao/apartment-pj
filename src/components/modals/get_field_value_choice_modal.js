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
      // createBankAccountCompleted: false,
      // deleteBankAccountCompleted: false,
    };
    // this.handleClose = this.handleClose.bind(this);
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

      console.log('in GetFieldValueChoiceModal, renderEachValue, this.props.fieldValueDocumentObject, eachFieldObject, elementName: ', this.props.fieldValueDocumentObject, eachFieldObject, elementName);
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
              type="checkbox"
              // onChange={}
              // checked={}
            />
          </div>
        </li>
      );
    });
  }

  renderButtons() {
    return (
      <div className="get-field-value-choice-modal-button-box">
        <div className="get-field-value-choice-modal-button-checkall-box">
          <div className="get-field-value-choice-modal-button-checkall-each">
            Check All
          </div>
          <div className="get-field-value-choice-modal-button-checkall-each">
            Uncheck All
          </div>
        </div>
        <div className="get-field-value-choice-modal-button-apply button-hover">
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
          {this.props.fieldValueDocumentObject.array.length > 0 ? this.renderEachValue() : 'There are no values available for the fields chosen from this document'}
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
