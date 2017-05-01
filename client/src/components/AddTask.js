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
import Button from 'grommet/components/Button'
import Label from 'grommet/components/Label'
import Anchor from 'grommet/components/Anchor'

import Spinning from 'grommet/components/icons/Spinning'
import CreditCard from 'grommet/components/icons/base/CreditCard'
import Paypal from 'grommet/components/icons/base/SocialPaypal'
import Previous from 'grommet/components/icons/base/FormPrevious'

import addTask from '../actions/addTask'

export default Component({
  componentWillMount() {
    this.loading = false;
    this.state = {
      loading: false,
      errorMessage: "",
      currency: "USD",
      label: "",
      deposit: 1,
      due: "",
      labelError: "",
      dueError: "",
      viewPage: "addTask",
      method: "paypal"
    }

    if (this.props.user.paymentMethods.length < 1) {
      Goto({
        path: "/dashboard/tasks/add/payment"
      });
    }
  },

  componentDidMount() {
    console.log("testing");
    for (var i=0; i < this.props.user.paymentMethods.length; i++) {
      if (this.props.user.paymentMethods[i].default)
        this.setState({defaultPayment: this.props.user.paymentMethods[i]});
    }
  },

  _methodClicked() {
    this.setState({viewPage: 'paymentMethod'});
  },

  _renderDefaultPayment() {
    let paymentMethods = this.props.user.paymentMethods;
    for (var i=0; i<paymentMethods.length; i++) {
      if (paymentMethods[i].default) {
        return (
          <Anchor primary={false} animateIcon={true}
                title="Current payment method. Click to change"
                icon={(paymentMethods[i].cardType && <CreditCard />) || <Paypal />}
                label={(paymentMethods[i].cardType && paymentMethods[i].cardType + " " + paymentMethods[i].last4) || paymentMethods[i].email} path={{path: "/dashboard/tasks/add/payment"}}
                onClick={() => {this._methodClicked()}}/>
        )
      }
    }
    return (<div></div>);
  },

  render() {
    return(
      <Layer align="right" closer={true} flush={true} onClose={() => {Goto({path:"/dashboard/tasks"})}}>
        {window.location.pathname.indexOf('payment') === -1 &&
        <Box margin={{top:"large"}}>
          <Form pad="small" onSubmit={e => {
            e.preventDefault();

            this.setState({loading: true});
            this.setState({labelError: ""});
            this.setState({dueError: ""});
            this.setState({errorMessage: ""});

            if (!this.state.label) this.setState({labelError: "Please add a label to the task"});
            if (!this.state.due) this.setState({dueError: "Please add a due date"});
            if (this.state.labelError || this.state.dueError) {
              this.setState({loading: false});
              return;
            }

            addTask(this.state, this.props.user, (success, message) => {
              if (!success) this.setState({errorMessage: message});

              this.setState({loading: false});
            });
          }}>
            <Heading align="center" tag="h2">Add a task</Heading>

            <FormField label="What are you planning to do?" error={this.state.labelError}>
              <TextInput name="label" onDOMChange={event => {this.setState({label: event.target.value});}} />
            </FormField>
            <FormField label="How much would you like to deposit?">
              <NumberInput name="deposit" min={1} value={this.state.deposit} onChange={event => {this.setState({deposit: event.target.value});}} />
            </FormField>
            <Box direction="row" justify="center" align="center" pad="small" wrap={true}>
              <Button align="center" label="USD $" primary={this.state.currency === "USD"} onClick={() => {this.setState({currency: "USD"});}} />
              <Button align="center" label="GBP £" primary={this.state.currency === "GBP"} onClick={() => {this.setState({currency: "GBP"});}} />
              <Button align="center" label="EUR €" primary={this.state.currency === "EUR"} onClick={() => {this.setState({currency: "EUR"});}} />
            </Box>
            <FormField label="When is it due?" error={this.state.dueError}>
              <DateTime id="due-date-input" value={this.state.due} format="M/D/YYYY h:mm a" name="due"
                onChange={ date => {
                  this.setState({due: date});
                } }/>
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center">
                <Box justify="center" direction="column">

                  <Box justify="center" align="center" direction="row" margin={{bottom: "small"}} pad="small">
                    {this.props.user && this._renderDefaultPayment()}
                  </Box>
                  <Button label='Save task & Place deposit'
                    type='submit'
                    primary={true}
                    align="center"
                    style={{width:"100%"}}
                    onClick={function() { console.log("track");}}>
                  </Button>
                  {this.state.errorMessage && <Label style={{color:'red'}}>{this.state.errorMessage}</Label>}
                  {this.state.loading && <Box direction="column" justify="center" align="center" pad="small"><Spinning /></Box>}
                </Box>

            </Footer>
          </Form>
        </Box>
        }

        {/** Payment method selection **/}
        { window.location.pathname.indexOf('payment') > -1 &&
          <Box>
            <Box justify="start" align="start">
              {this.props.user.paymentMethods.length > 0 && <Anchor primary={false} animateIcon={true} icon={<Previous size="medium" />} path={{path: "/dashboard/tasks/add"}} onClick={() => {this.setState({viewPage: "addTask"})}} />}
            </Box>
            {this.props.children}
          </Box>
        }

      </Layer>
    );
  }
}, state => ({
  user: state.user
}));
