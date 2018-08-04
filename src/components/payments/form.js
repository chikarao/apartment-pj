import React, { Component } from 'react';
import axios from 'axios';
import { CardElement, injectStripe } from 'react-stripe-elements';

// import {
//   Button
// } from 'semantic-ui-react';

// import './scss/index.scss';

// const STRIPE_API = 'https://api.stripe.com/v1/charges';
const STRIPE_API = 'http://localhost:3000/api/v1/new_subscription';

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '18px',
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

type ElementsProps = {
  locale?: 'en'
  // fonts?: Array<Object>,
  // The full specification for `elements()` options is here: https://stripe.com/docs/elements/reference#elements-options
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      planId: 'plan_DM2s9FEFa6hjiN',
      planName: 'TestPlan',
      planAmount: 1,
      email: 'test1@test.com'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.stripe.createToken({ name: this.state.email }).then(({ token }) => {
      console.log('in stripe form, handleSubmit, token, planId, email', token, this.state.email, this.state.planId)
    // request to API end point
      axios.post(STRIPE_API,
        {
          stripeToken: token.id,
          client: this.state.email,
          plan: this.state.planId
        }
      )
      .then(response => {
        console.log('response to stripe, response: ', response);
        console.log('response to stripe, response.data.data: ', response.data.data);
      });
    });
  }

  render() {
    // <button fluid className="stripe-pay-button">Make Payment</button>
    return (
      <div className="checkout">
      <div>Payment</div>
        <form
          className="stripe-form"
          onSubmit={this.handleSubmit}
        >
          <CardElement
            {...createOptions()}
          />
          <button className="stripe-pay-button">Make Payment</button>
        </form>
      </div>
    );
  }
}

// IMPORTANT！
export default injectStripe(Form);
