import React, { Component } from 'react';
import axios from 'axios';

import { CardElement, injectStripe } from 'react-stripe-elements';

import { connect } from 'react-redux';
import * as actions from '../../actions';


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

    this.props.stripe.createToken({ name: this.props.auth.email }).then(({ token }) => {
      console.log('in stripe form, handleSubmit, token, planId, email', token, this.state.email, this.state.planId)
      console.log('in stripe form, handleSubmit, this.props.auth.customer.id', this.props.auth.customer.id)
      console.log('in stripe form, handleSubmit, this.props.cardActionType ', this.props.cardActionType)
      // request to API end point
      // this.props.updateCardInfo is called in card_input_modal
      // if (this.props.cardActionType == 'Add a Card') {
        if (this.props.auth.customer.id) {
          console.log('in stripe form, handleSubmit, if this.props.auth.stripe_customer_id, token', this.props.auth.customer.id, token)
          this.props.addCard({ token: token.id });
        } else {
          this.props.newCustomer({ token: token.id, email: this.props.auth.email })
        }
      // }

      // if (this.props.cardActionType == 'Edit Card Info') {
      //   this.props.newCustomer({ token, client: this.props.auth.email })
      // }
      // axios.post(STRIPE_API,
      //   {
      //     stripeToken: token.id,
      //     client: this.state.email,
      //     plan: this.state.planId
      //   }
      // )
      // .then(response => {
      //   console.log('response to stripe, response: ', response);
      //   console.log('response to stripe, response.data.data: ', response.data.data);
      // });
    });
  }

  renderFullCardInput() {
    return (
      <div>
        <CardElement
        {...createOptions()}
        />
      </div>
    );
  }

  renderUpdateInput() {
    return (
      <div>
        <input name="exp_year" type="integer" />
        <input name="exp_month" type="integer" />
      </div>
    )
  }

  render() {
    // <button fluid className="stripe-pay-button">Make Payment</button>
    {this.renderUpdateInput()}
    console.log('in stripe form, handleSubmit, this.props.actionType', this.props.auth.cardActionType)
    console.log('in stripe form, handleSubmit, this.props', this.props)
    return (
      <div className="checkout">
        <form
          className="stripe-form"
          onSubmit={this.handleSubmit}
        >
        {this.renderFullCardInput()}
          <button className="stripe-pay-button">{this.props.buttonText}</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in stripe form, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    auth: state.auth,
  };
}

// IMPORTANT！
export default connect(mapStateToProps, actions)(injectStripe(Form));
// connect(mapStateToProps, { fetchCards, submitPurchase })(injectStripe(DepositElements))
