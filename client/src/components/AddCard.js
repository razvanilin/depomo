import React from 'react'
import { Component } from 'jumpsuit'

import Box from 'grommet/components/Box'
import Spinning from 'grommet/components/icons/Spinning'

import addPaymentMethod from '../actions/addPaymentMethod'

export default Component({
  componentWillMount() {

    this.state = {
      errorMessage: ""
    }

    setTimeout(() => {
      // Create a Stripe client
      var stripe = window.Stripe('pk_test_pVjsEbg6KUNJTCdoAnvK1ViN');

      // Create an instance of Elements
      var elements = stripe.elements();

      // Custom styling can be passed to options when creating an Element.
      // (Note that this demo uses a wider set of styles than the guide below.)
      var style = {
        base: {
          color: '#32325d',
          lineHeight: '24px',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };

      // Create an instance of the card Element
      var card = elements.create('card', {style: style});

      // Add an instance of the card Element into the `card-element` <div>
      card.mount('#card-element');

      // Handle real-time validation errors from the card Element.
      card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });

      // save user's id to be accessible in the form event
      var userId = this.props.user._id;

      // Handle form submission
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
        event.preventDefault();

        stripe.createToken(card).then(function(result) {
          if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            // Send the token to your server
            addPaymentMethod("card", result.token, userId, (error, data) => {
              if (error) {
                //this.parent.setState({errorMessage: error});
                return;
              }
              // this.parent.setState({addSuccess: true});
            });
          }
        });
      });
    });
  },

  render() {
    return (
      <Box pad="medium" justify="center">
        <form action="/charge" method="post" id="payment-form">
          <div className="form-row">
            <label htmlFor="card-element">
              Credit or debit card
            </label>
            <div id="card-element">

            </div>

            <div id="card-errors" role="alert"></div>
          </div>

          <Box pad="medium" justify="center" align="center" direction="column">
            <button onClick={() => { this.setState({loading: true})}}>Save payment method</button>
            {this.state.loading && <Spinning />}
          </Box>
        </form>
      </Box>
    )
  }
}, state => ({
  user: state.user
}))
