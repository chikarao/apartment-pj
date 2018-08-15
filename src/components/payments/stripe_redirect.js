import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';


class StripeRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      stripeLinkEstablished: false
    });
  }

  componentDidMount() {
    // query strings with react router: https://stackoverflow.com/questions/42862253/how-to-parse-query-string-in-react-router-v4
    // uses native javascript URLSearchParams; there is query-string API but use native
    console.log('in StripeRedirect, componentDidMount, this.props.match.params: ', this.props.match.params.params);
    const params = this.props.match.params.params;
    const parsedParams = new URLSearchParams(params);
    let AUTHORIZATION_CODE = '';
    let scope = '';
    let error = '';

    console.log('in StripeRedirect, componentDidMount, parsedParams: ', parsedParams);
    if (parsedParams.get('code')) {
      AUTHORIZATION_CODE = parsedParams.get('code');
      scope = parsedParams.get('scope');
    } else {
      error = parsedParams.get('scope');
      this.props.authError(error);
    }
    // console.log('in StripeRedirect, componentDidMount, params, scope: ', scope);
    // console.log('in StripeRedirect, componentDidMount, params, AUTHORIZATION_CODE: ', AUTHORIZATION_CODE);
    // console.log('in StripeRedirect, componentDidMount, params, error: ', error);
    // NEED action since need to secret key!!!!
    this.props.fetchStripeUserCredentials({ code: AUTHORIZATION_CODE, grant_type: 'authorization_code' }, (clientId) => this.fetchStripeUserCredentialsCallback(clientId))
  }

  fetchStripeUserCredentialsCallback(clientId) {
    console.log('in StripeRedirect, fetchStripeUserCredentialsCallback, clientId: ', clientId);
    if (clientId) {
      this.setState({ stripeLinkEstablished: true })
    }
  }

  render() {
    return (
      <div className="stripe-redirect-message" style={{ margin: '100px auto 0 auto', fontSize: '17px' }}>{this.state.stripeLinkEstablished ? 'Your account was successfully linked to our platform!' : 'In process...'}</div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in StripeRedirect, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(StripeRedirect);
