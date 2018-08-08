import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { CardElement, injectStripe } from 'react-stripe-elements';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import cardAddressInputObject from '../constants/card_address_input'

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

  componentDidMount() {

  }

  handleSubmit(event) {
    event.preventDefault();

    const tokenData = {
      name: event.target[0].value,
      address_line1: event.target[1].value,
      address_line2: event.target[2].value,
      address_city: event.target[3].value,
      address_state: event.target[4].value,
      address_zip: event.target[5].value,
      address_country: event.target[6].value
      // currency: event.target[7].value
    };

    this.props.stripe.createToken(tokenData).then(({ token }) => {
      // console.log('in stripe form, handleSubmit, token, planId, email', token, this.state.email, this.state.planId)
      // console.log('in stripe form, handleSubmit, this.props.auth.customer.id', this.props.auth.customer.id)
      // console.log('in stripe form, handleSubmit, this.props.cardActionType ', this.props.cardActionType)
      // request to API end point
      // this.props.updateCardInfo is called in card_input_modal
      // if (this.props.cardActionType == 'Add a Card') {
        if (this.props.auth.customer) {
          console.log('in stripe form, handleSubmit, if this.props.auth.stripe_customer_id, token', this.props.auth.customer.id, token)
          if (token) {
            this.props.addCard({ token: token.id }, () => this.handleSubmitCallback());
            this.props.showLoading()
          } else {
            this.props.authError('Cannot process card info, please try again.')
          }
        } else {
          if (token) {
            this.props.newCustomer({ token: token.id, email: this.props.auth.email }, () => this.handleSubmitCallback())
            this.props.showLoading()
          } else {
            this.props.authError('Cannot process card info, please try again.')
          }
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

  handleSubmitCallback() {
    console.log('in stripe form, handleSubmit, handleSubmitCallback')
    this.props.showLoading();
    this.props.showCardInputModal();
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

  renderAddressInput() {
    // The address_country field is a two character country code (for example, 'US').
    return _.map(Object.keys(cardAddressInputObject), (inputs, i) => {
      return (
        <div key={i} className="form-group card-form-group">
        <label className="create-flat-form-label">{cardAddressInputObject[inputs]}: </label>
        <input type="text" className="form-control card-form-control" />
        </div>
      );
    });
  }

  render() {
    // <button fluid className="stripe-pay-button">Make Payment</button>
    // {this.renderUpdateInput()}
    console.log('in stripe form, handleSubmit, this.props.actionType', this.props.auth.cardActionType)
    console.log('in stripe form, handleSubmit, this.props', this.props)
    return (
      <div className="checkout">
        <form
          className="stripe-form"
          onSubmit={this.handleSubmit}
        >
          {this.renderAddressInput()}
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
