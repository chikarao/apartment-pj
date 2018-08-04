import React from 'react';

import {
  Elements
} from 'react-stripe-elements';

import Form from './form';

class Parent extends React.Component {
  render() {
    return (
      <Elements>
        <Form />
      </Elements>
    );
  }
}

export default Parent;
