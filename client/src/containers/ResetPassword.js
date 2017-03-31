import React from 'react'
import { Component } from 'jumpsuit'

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
    this.errors = {};
    this.newPassword = {};
  },

  _resetPassword() {
    this.errors = {};
    if (!this.newPassword.password || this.newPassword.password.length < 8) {
      this.errors.password = "The password must be at least 6 characters long";
    }
    if (!this.newPassword.confirm || this.newPassword.password !== this.newPassword.confirm) {
      this.errors.confirm = "The passwords do not match";
    }
    if (Object.keys(this.errors).length > 0) {
      this.forceUpdate();
      return;
    }

    this.forceUpdate();

    resetPassword(this.newPassword.password, (success, data) => {
      if (!success) {
        this.errorMessage = data;
        this.forceUpdate();
      }
    });
  },

  render() {
    return (
      <App>
        <Header direction="column" align="center" alignContent="center" justify="center">
          <Image size="large" src={LogoImage} />

          <Form pad="medium" onSubmit={e => {
            e.preventDefault();
            this._resetPassword();
          }}>
            <FormField label="New password" error={this.errors.password}>
              <TextInput type="password" name="password" onDOMChange={event => {this.newPassword.password = event.target.value}}/>
            </FormField>
            <FormField label="Confirm password" error={this.errors.confirm}>
              <TextInput type="password" name="confirm" onDOMChange={event => {this.newPassword.confirm = event.target.value}}/>
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

                {this.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
                {this.errorMessage && <Label style={{color:'red'}}>{this.errorMessage}</Label>}
              </Columns>
            </Footer>
          </Form>
        </Header>
      </App>
    )
  }
})
