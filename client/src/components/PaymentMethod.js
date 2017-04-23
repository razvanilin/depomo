import React from 'react'
import { Component } from 'jumpsuit'

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

import AddCard from './AddCard'

export default Component({
  componentWillMount() {
    this.state = {
      method: this.props.user.preferedPayment || ''
    }
  },

  render() {
    return (
      <Box>
        <Form pad="small" onSubmit={e => {
          e.preventDefault();
        }}>
          <Heading align="center" tag="h2">Payment Options</Heading>

          <List selectable={true}>
            <ListItem responsive={false} justify="between" onClick={() => {this.setState({method:'paypal'})}}>
              <Anchor primary={this.state.method === 'paypal'} animateIcon={true} icon={<Paypal />} label="Paypal"/>
              {this.state.method === 'paypal' && <span><Checkmark colorIndex="ok" /></span>}
            </ListItem>
            <ListItem responsive={false} justify="between" onClick={() => {this.setState({method:'card'})}}>
              <Anchor primary={this.state.method === 'card'} animateIcon={true} icon={<CreditCard />} label="Credit or Debit Card"/>
              {this.state.method === 'card' && <span><Checkmark colorIndex="ok" /></span>}
            </ListItem>
          </List>

          <Footer pad={{"vertical": "medium"}} justify="center">
              <Box justify="center" direction="column">
                <Button label='Save payment method'
                  type='submit'
                  primary={true}
                  align="center"
                  style={{width:"100%"}}
                  onClick={function() { console.log("track");}}>
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
