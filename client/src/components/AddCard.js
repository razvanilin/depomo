import React from 'react'
import { Component } from 'jumpsuit'

const braintree = require('braintree-web');
var hostedFields;

import Label from 'grommet/components/Label'
import Button from 'grommet/components/Button'
import Box from 'grommet/components/Box'

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

        braintree.hostedFields.create({
          client: clientInstance,
          styles: {
            'input': {
              'font-size': '14pt'
            },
            'input.invalid': {
              'color': 'red'
            },
            'input.valid': {
              'color': 'green'
            }
          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: '10/2019'
            },
            postalCode: {
              selector: '#postal-code',
              placeholder: '11111'
            }
          }
        }, function (hostedFieldsErr, hostedFieldsInstance) {
          if (hostedFieldsErr) {
            // Handle error in Hosted Fields creation
            return;
          }
          hostedFields = hostedFieldsInstance
        });
      });
    });
  },

  _sendNonce() {
    addPaymentMethod("card", hostedFields, this.props.user._id, (success, data) => {
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
      <form id="cardForm" action="http://localhost:3010/payment/customer" method="post" onSubmit={e=>e.preventDefault()}>
        <Box id="error-message"></Box>

        <Label labelFor="card-number">Card number</Label>
        <Box className="hosted-field" id="card-number"></Box>

        <Label labelFor="cvv">CVV</Label>
        <Box className="hosted-field" id="cvv"></Box>

        <Label labelFor="expiration-date">Expiration Date</Label>
        <Box className="hosted-field" id="expiration-date"></Box>

        <Label labelFor="postal-code">Postal Code</Label>
        <Box className="hosted-field" id="postal-code"></Box>

        <Button type="submit" label="Save card" onClick={()=>this._sendNonce()} />
      </form>
    )
  }
}, state => ({
  user: state.user
}))
