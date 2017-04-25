import React from 'react'
import { Component } from 'jumpsuit'

const braintree = require('braintree-web');
var paypal;

import Button from 'grommet/components/Button'
import Box from 'grommet/components/Box'
import Paypal from 'grommet/components/icons/base/SocialPaypal'

import getClientAuthorization from '../actions/getClientAuthorization'
import addPaymentMethod from '../actions/addPaymentMethod'

export default Component({
  componentWillMount() {

    this.state = {
      errorMessage: ""
    }

    getClientAuthorization(this.props.user._id, (success, data) => {
      if (!success) {
        this.setState({errorMessage: data});
        return;
      }

      var authorization = data.clientToken;

      braintree.client.create({
        authorization: authorization
      }, function (clientErr, clientInstance) {
        if (clientErr) {
          // Handle error in client creation
          return;
        }
        // Create PayPal component
        braintree.paypal.create({
          client: clientInstance
        }, function (paypalErr, paypalInstance) {
          if (paypalErr) {
            console.log(paypalErr);
            return;
          }
          paypal = paypalInstance;
        });
      });
    });
  },

  _sendNonce() {
    addPaymentMethod('paypal', paypal, this.props.user._id, (success, data) => {
      if (!success) {
        this.setState({errorMessage: data});
        return;
      }

      this.setState({addSuccess: true});
      console.log(data);
    });
  },

  render() {
    return (
      <Box>
        <Button id="paypal-button" accent={true} label="Connect to Paypal" icon={<Paypal />} onClick={() => this._sendNonce()}/>
      </Box>
    )
  }
}, state => ({
  user: state.user
}))
