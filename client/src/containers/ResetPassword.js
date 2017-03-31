import React from 'react'
import { Link, Component } from 'jumpsuit'

import LogoImage from '../images/depomo_logo.png';

import App from 'grommet/components/App'
import Header from 'grommet/components/Header'
import Image from 'grommet/components/Image'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Box from 'grommet/components/Box'
import Columns from 'grommet/components/Columns'
import Footer from 'grommet/components/Footer'
import Button from 'grommet/components/Button'
import TextInput from 'grommet/components/TextInput'
import Label from 'grommet/components/Label'
import Spinning from 'grommet/components/icons/Spinning'

import resetPassword from '../actions/resetPassword'

export default Component({

  componentWillMount() {
    this.state = {
      loading: false,
      password: "",
      confirm: "",
      errors: {}
    };
  },

  _resetPassword() {
    this.setState({errorMessage: ""});
    this.setState({loading: true});
    this.setState({errors: {}});

    if (!this.state.password || this.state.password.length < 6) {
      this.setState({errors: {password: "The password must be at least 6 characters long"}});
    }
    if (!this.state.confirm || this.state.password !== this.state.confirm) {
      this.setState({errors: {confirm: "The passwords do not match"}});
    }
    if (this.state.errors.password || this.state.errors.confirm) {
      this.setState({loading: false});
      return;
    }

    resetPassword({password: this.state.password, confirm: this.state.confirm}, (success, data) => {
      if (!success) {
        this.setState({errorMessage: data});
      }
      this.setState({loading: false});
    });
  },

  render() {
    return (
      <App>
        <Header direction="column" align="center" alignContent="center" justify="center">
          <Link to="/"><Image size="large" src={LogoImage} /></Link>

          <Form pad="medium" onSubmit={e => {
            e.preventDefault();
            this._resetPassword();
          }}>
            <FormField label="New password" error={this.state.errors.password}>
              <TextInput type="password" name="password" onDOMChange={event => {this.setState({password: event.target.value})}}/>
            </FormField>
            <FormField label="Confirm password" error={this.state.errors.confirm}>
              <TextInput type="password" name="confirm" onDOMChange={event => {this.setState({confirm: event.target.value})}}/>
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center">
              <Columns justify="center">
                <Box justify="center">
                  <Button label='Change password'
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
        </Header>
      </App>
    )
  }
})
