import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

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
    return (
      <li className="get-field-value-choice-modal-values-each">
        <div className="get-field-value-choice-modal-values-each-text-box">
          <div className="get-field-value-choice-modal-values-each-text-box-key">
            Construction
          </div>
          <div className="get-field-value-choice-modal-values-each-text-box-value">
            SRC
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
      <div className="get-field-value-choice-modal-main">
        <div className="get-field-value-choice-modal-title">Available Values</div>
        <ul className="get-field-value-choice-modal-scrollbox">
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
          {this.renderEachValue()}
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
    // flat: state.selectedFlatFromParams.selectedFlatFromParams,
  };
}


export default connect(mapStateToProps, actions)(GetFieldValueChoiceModal);


  // Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
