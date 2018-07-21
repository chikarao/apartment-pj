import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


import * as actions from '../../actions';

let showHideClassName;

class Loading extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     editProfileCompleted: false
  //   };
  // }

  // componentDidMount() {
  // }

  renderLoading() {
    showHideClassName = this.props.show ? 'loading display-block' : 'loading display-none';
    // showHideClassName = 'loading display-block'
    console.log('in modal, render showHideClassName:', showHideClassName);
    console.log('in modal, render this.props.show:', this.props.show);
    console.log('in modal, render this.props:', this.props);
    //handleClose is a prop passed from header when SigninModal is called
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
  console.log('in Loading, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userProfile: state.auth.userProfile
    initialValues: state.auth.userProfile
  };
}


export default connect(mapStateToProps, actions)(Loading);
