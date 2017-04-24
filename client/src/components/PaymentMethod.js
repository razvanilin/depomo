import React from 'react'
import { Component, Goto } from 'jumpsuit'

import Form from 'grommet/components/Form'
import List from 'grommet/components/List'
import Anchor from 'grommet/components/Anchor'
import ListItem from 'grommet/components/ListItem'
import Label from 'grommet/components/Label'
import Footer from 'grommet/components/Footer'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Heading from 'grommet/components/Heading'

import Paypal from 'grommet/components/icons/base/SocialPaypal'
import Checkmark from 'grommet/components/icons/base/Checkmark'
import CreditCard from 'grommet/components/icons/base/CreditCard'
import Spinning from 'grommet/components/icons/Spinning'
import Add from 'grommet/components/icons/base/Add'

import AddCard from './AddCard'
import selectPaymentMethod from '../actions/selectPaymentMethod'

export default Component({
  componentWillMount() {
    this.state = {
      method: this.props.user.preferedPayment || 'paypal'
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
        <Box justify="center" align="center">
          <Label>No payment methods have been saved yet.</Label>
        </Box>
      )
    }

    return (
      <List selectable={true}>
        {this.props.user.paymentMethods && this.props.user.paymentMethods.length > 0 && <Label>Your saved payment methods:</Label>}
        {this.props.user.paymentMethods.map(paymentMethod => {
          return (
            <ListItem key={paymentMethod.token} responsive={false} justify="between" onClick={()=>{this._selectPaymentMethod(paymentMethod.token)}}>
              <Anchor primary={paymentMethod.default} animateIcon={true}
                      icon={(paymentMethod.cardType!=="Paypal" && <CreditCard />) || (paymentMethod.cardType==="Paypal" && <Paypal />)}
                      label={paymentMethod.cardType + " " + paymentMethod.last4}
                      onClick={() => console.log(paymentMethod.cardType + " clicked")}/>
              {paymentMethod.default && <Checkmark colorIndex="ok" />}
              {paymentMethod.token === this.state.selectedMethod && <Spinning />}
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

          <Footer pad={{"vertical": "medium"}} justify="center">
              <Box justify="center" direction="column">
                <Button label='Add payment method'
                  type='button'
                  icon={<Add />}
                  primary={false}
                  align="center"
                  style={{width:"100%"}}
                  onClick={() => { this.setState({method: 'card'})}}>
                </Button>
                {this.state.loading && <Box direction="column" justify="center" align="center" pad="small"><Label>Redirecting you to PayPal</Label><Spinning /></Box>}
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
