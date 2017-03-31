import React from 'react'
import { Component, Goto } from 'jumpsuit'
// grommet
import Layer from 'grommet/components/Layer'
import Box from 'grommet/components/Box'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'
import Heading from 'grommet/components/Heading'
import Footer from 'grommet/components/Footer'
import Button from 'grommet/components/Button'
import Columns from 'grommet/components/Columns'
import Label from 'grommet/components/Label'
import Header from 'grommet/components/Header'

// grommet icons
import Spinning from 'grommet/components/icons/Spinning'
import Checkmark from 'grommet/components/icons/base/Checkmark'

// actions
import forgotPassword from '../actions/forgotPassword'

export default Component({
  componentWillMount() {
    this.state = {
      errors: {},
      errorMessage: "",
      loading: false
    }
  },

  _onSubmitForm() {
    this.setState({loading: true});
    this.setState({errors: {}});
    this.setState({errorMessage: ""});

    if (!this.state.email) {
      this.setState({errors: {email: "Please enter a valid email"}});
      this.setState({loading: false});
      return;
    }

    forgotPassword(this.state.email, (success, data) => {
      if (!success) {
        this.setState({errorMessage: data});
      } else {
        this.setState({success: true});
      }

      this.setState({loading: false});
    });
  },

  _renderForm() {
    return (
      <Form pad="medium" onSubmit={e => {e.preventDefault(); this._onSubmitForm()}}>
        <Heading align="center" tag="h2">Forgot Password</Heading>

        <FormField label="Email" error={this.state.errors.email}>
          <TextInput name="email" onDOMChange={event => {this.setState({email: event.target.value})}}/>
        </FormField>

        <Footer pad={{"vertical": "medium"}} justify="center">
          <Columns justify="center">
            <Box justify="center">
              <Button label='Request new password'
                type='submit'
                primary={true}
                align="center"
                style={{width:"100%"}}
                onClick={function() { console.log("change");}}>

              </Button>
            </Box>

            {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
            {this.state.errorMessage && <Label style={{color:'red'}}>{this.state.errorMessage}</Label>}
          </Columns>
        </Footer>
      </Form>
    )
  },

  _renderSuccess() {
    return (
      <Box pad="medium">
      <Header direction="column">
        <Heading><Checkmark colorIndex="ok"/></Heading>
        <Heading tag="h3">An email with instructions has been sent to {this.state.email} and should arrive shortly.</Heading>
        <Button primary={true} label="Resend email" onClick={() => {this._onSubmitForm()}}/>
      </Header>
      </Box>
    )
  },

  render() {
    return(
      <Layer closer={true} flush={true} onClose={() => {Goto({path: "/"})}}>
        <Box>
          {!this.state.success && this._renderForm()}
          {this.state.success && this._renderSuccess()}
        </Box>
      </Layer>
    )
  }
});
