import React, { Component } from 'react';

import { Elements } from 'react-stripe-elements';

import Form from './form';

class Parent extends Component {
  render() {
    return (
      <Elements>
        <Form
          buttonText={this.props.buttonText}
          // actionType={this.props.actionType}
        />
      </Elements>
    );
  }
}

export default Parent;
