import React from 'react'
import { Component, Goto } from 'jumpsuit'

import Layer from 'grommet/components/Layer'
import Box from 'grommet/components/Box'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Heading from 'grommet/components/Heading'
import TextInput from 'grommet/components/TextInput'
import NumberInput from 'grommet/components/NumberInput'
import DateTime from 'grommet/components/DateTime'
import Footer from 'grommet/components/Footer'
import Columns from 'grommet/components/Columns'
import Button from 'grommet/components/Button'

import Spinning from 'grommet/components/icons/Spinning'

import addActivity from '../actions/addActivity'

export default Component({
  componentWillMount() {
    this.loading = false;
    this.activity = {currency: "USD"};
  },

  _checkCurrency(currency) {
    if (this.activity.currency === currency) {
      console.log(currency);
      return true;
    }

    console.log(currency);
    return false
  },

  _onCurrencyClick() {
    this.activity.currency = "GBP";
  },

  render() {
    let interval = setInterval(() => {
      if (this.activity.due && document.getElementById("due-date-input")) {
        document.getElementById("due-date-input").value = this.activity.due;
      }
    }, 500);

    let eurClicked = this.activity.currency === "EUR";
    let usdClicked = this.activity.currency === "USD";
    let gbpClicked = this.activity.currency === "GBP";
    console.log(this.activity.currency);
    return(
      <Layer align="right" closer={true} flush={true} onClose={() => {clearInterval(interval); Goto({path:"/dashboard/activities"})}}>

        <Box>
          <Form pad="small" onSubmit={e => {
            e.preventDefault();
            console.log(this.activity);
            clearInterval(interval);

            addActivity(this.activity, this.props.user._id);
          }}>
            <Heading align="center" tag="h2">Add an activity</Heading>

            <FormField label="What are you planning to do?">
              <TextInput name="label" onDOMChange={event => {this.activity.label = event.target.value}} />
            </FormField>
            <FormField label="How much would you like to deposit?">
              <NumberInput name="deposit" min={1} onChange={event => {this.activity.deposit = event.target.value}} />
            </FormField>
            <Box direction="row" justify="center" align="center" pad="small" wrap={true}>
              <Button align="center" label="USD $" primary={usdClicked} onClick={() => {this.activity.currency = "USD"; this.forceUpdate()}} />
              <Button align="center" label="GBP £" primary={gbpClicked} onClick={() => {this.activity.currency = "GBP"; this.forceUpdate()}} />
              <Button align="center" label="EUR €" primary={eurClicked} onClick={() => {this.activity.currency = "EUR"; this.forceUpdate()}} />
            </Box>
            <FormField label="When is it due?">
              <DateTime id="due-date-input" format="M/D/YYYY h:mm a" name="due"
                onChange={ date => {
                  this.activity.due = date;
                  if (date && date.length > 0) {
                    document.getElementById("due-date-input").value = this.activity.due;
                  }
                } }/>
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center">
              <Columns justify="center">
                <Box justify="center">
                  <Button label='Track activity'
                    type='submit'
                    primary={true}
                    align="center"
                    style={{width:"100%"}}
                    onClick={function() { clearInterval(interval); console.log("track");}}>

                  </Button>
                </Box>

                {this.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
              </Columns>
            </Footer>
          </Form>
        </Box>
      </Layer>
    );
  }
}, state => ({
  user: state.user
}));
