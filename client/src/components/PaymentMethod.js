import React from 'react'
import { Component, Goto } from 'jumpsuit'

import Form from 'grommet/components/Form'
import List from 'grommet/components/List'
import Anchor from 'grommet/components/Anchor'
import ListItem from 'grommet/components/ListItem'
import Label from 'grommet/components/Label'
import Footer from 'grommet/components/Footer'
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'

import Checkmark from 'grommet/components/icons/base/Checkmark'
import CreditCard from 'grommet/components/icons/base/CreditCard'
import Spinning from 'grommet/components/icons/Spinning'
import Add from 'grommet/components/icons/base/Add'

import AddCard from './AddCard'
import selectPaymentMethod from '../actions/selectPaymentMethod'

export default Component({
  componentWillMount() {
    this.state = {
      method: ''
    }
  },

  _selectPaymentMethod(token) {

    this.setState({selectedMethod: token});

    selectPaymentMethod(token, {
      options: {
        makeDefault: true
      }
    }, this.props.user._id, (success) => {
      if (!success) return this.setState({selectError: true});

      Goto({
        path: "/dashboard/tasks/add"
      });
    });
  },

  _renderPaymentMethods() {
    if (this.props.user.paymentMethods.length === 0) {
      return (
        <Box direction="column" justify="center" align="center">
          <Label>No payment methods have been saved yet.</Label>
          <Label align="center">You must add a payment method before adding new tasks or connecting to Google Calendar</Label>
        </Box>
      )
    }

    return (
      <List selectable={true}>
        {this.props.user.paymentMethods && this.props.user.paymentMethods.length > 0 && <Label>Your saved payment methods:</Label>}
        {this.props.user.paymentMethods.map(paymentMethod => {
          return (
            <ListItem key={paymentMethod.id} responsive={false} justify="between" onClick={()=>{this._selectPaymentMethod(paymentMethod.id)}}>
              <Anchor primary={this.props.user.defaultSource === paymentMethod.id} animateIcon={true}
                      icon={ <CreditCard /> }
                      label={paymentMethod.brand + " - ending in " + paymentMethod.last4}
                      onClick={() => console.log(paymentMethod.cardType + " clicked")}/>
              {(this.props.user.defaultSource === paymentMethod.id) && <Checkmark colorIndex="ok" />}
              {paymentMethod.id === this.state.selectedMethod && <Spinning />}
            </ListItem>
          )
        })}
      </List>
    )
  },

  render() {
    return (
      <Box>
        <Form pad="small" onSubmit={e => {
          e.preventDefault();
        }}>
          <Heading align="center" tag="h2">Payment Options</Heading>

          <Box pad="small">
          {this._renderPaymentMethods()}
          </Box>

          <Footer pad={{"vertical": "medium"}} justify="start" direction="column">
              <Box justify="start" align="start" direction="column" pad="small">
                <Anchor animateIcon={true} icon={<Add />} label="Add Debit or Credit card" onClick={() => this.setState({method:'card'})} />
              </Box>
          </Footer>
        </Form>

        {this.state.method === 'card' &&
          <Box>
            <AddCard />
          </Box>
        }
      </Box>
    )
  }
}, state => ({
  user: state.user
}));
