import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

let showHideClassName;

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressBarWidthPx: 0
    };
  }

  // componentDidMount() {
  // }
  componentDidUpdate(prevProps) {
    if (!prevProps.progressStatus && this.props.progressStatus) {
      const bar = document.getElementById('progress-bar-bar');
      const bounds = bar.getBoundingClientRect()
      // console.log('in loading modal, componentDidUpdate, bounds, this.props.progressStatus:', bounds, this.props.progressStatus);
      this.setState({ progressBarWidthPx: bounds.width }, () => {
        console.log('in loading modal, componentDidUpdate, this.state.progressBarWidthPx, this.props.progressStatus:', this.state.progressBarWidthPx, this.props.progressStatus);
      });
    }
  }

  renderProgressEach() {
    const { progressBarWidthPx } = this.state;
    return (
      <div style={{ height: '100%', backgroundColor: 'blue', width: this.props.progressStatus.progress_percentage ? progressBarWidthPx * (this.props.progressStatus.progress_percentage / 100) : 0 }}>
      </div>
    );
  }

  renderLoading() {
    showHideClassName = this.props.show ? 'loading display-block' : 'loading display-none';
    // showHideClassName = 'loading display-block'
    // console.log('in modal, render this.props.show:', this.props.show);
    // console.log('in modal, render this.props:', this.props);
    //handleClose is a prop passed from header when SigninModal is called
    // <div className="loading-spinner">
    // </div>
    console.log('in loading modal, renderLoading, this.state.progressBarWidthPx, this.props.progressStatus:', this.state.progressBarWidthPx, this.props.progressStatus);
    if (this.props.progressStatus) {
      return (
        <div className={showHideClassName}>
            <div className="progress-bar-container">
              <div className="progress-bar-bar" id="progress-bar-bar">
                {this.renderProgressEach()}
              </div>
              <div className="progress-bar-status">
                {`${this.props.progressStatus.progress_percentage}%`}
              </div>
            </div>
        </div>
      );
    }

    return (
      <div className={showHideClassName}>
        <div className="loading-spinner">
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          <div className="spinner">Working on it...</div>
        </div>
      </div>
    );
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.renderLoading()}
      </div>
    );
  }
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  // console.log('in Loading, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userProfile: state.auth.userProfile
    initialValues: state.auth.userProfile,
    progressStatus: state.documents.progressStatus
  };
}


export default connect(mapStateToProps, actions)(Loading);
