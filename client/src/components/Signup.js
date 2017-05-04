import React from 'react';
import { Component, Goto } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import Label from 'grommet/components/Label';
import Spinning from 'grommet/components/icons/Spinning';

import SocialFacebook from 'grommet/components/icons/base/SocialFacebook'
import SocialGoogle from 'grommet/components/icons/base/PlatformGoogle'

import socialLogin from '../actions/socialLogin'

import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'

// actions
import signup from '../actions/signup';

export default Component({
  componentWillMount() {
    this.state = {
      name: "",
      email: "",
      password: "",
      agree: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      agreeError: ""
    };
  },

  _facebookLogin() {
    this.setState({loading: true});
  },

  _facebookResponse(response) {
    socialLogin(response, (err, result) => {
      this.setState({loading: false});
    });
  },

  _googleLogin (response) {
    console.log(response);
    this.setState({loading: true});
    var tempResponse = response.profileObj;
    tempResponse.accessToken = response.accessToken;
    socialLogin(tempResponse, (err, result) => {
      this.setState({loading: false})
    });
  },

  render() {
    return(
      <Layer closer={true} flush={true} onClose={() => {Goto({path:"/"})}}>
        <Box direction="column">
          <Form pad="medium" onSubmit={e => {
            e.preventDefault();

            // validation
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            this.setState({nameError: ""});
            this.setState({emailError: ""});
            this.setState({passwordError: ""});
            this.setState({agreeError: ""});
            this.setState({loading: true});

            if (!this.state.name || this.state.name.length < 1) {
              this.setState({nameError: "Please enter your name."});
            }
            if (!this.state.email || !this.state.email.match(mailformat)) {
              this.setState({emailError: "Please enter a valid email."});
            }
            if (!this.state.password || this.state.password.length < 6) {
              this.setState({passwordError: "Please enter a password that's longer than 6 characters."});
            }
            if (!this.state.agree) {
              this.setState({agreeError: " "});
            }

            if (this.state.nameError || this.state.emailError || this.state.passwordError || this.state.agreeError) {
              this.setState({loading: false});
              return;
            }

            signup(this.state, (success, message) => {
              if (!success) this.setState({errorMessage: message});

              this.setState({loading: false});
            });
          }}>
            <Header align="center" justify="center">
              <Heading strong={true} align="center">
                Signup
              </Heading>
            </Header>

            <FormField label="Name" error={this.state.nameError}>
              <TextInput name="name" onDOMChange={event => {this.setState({name: event.target.value});}} />
            </FormField>
            <FormField label="Email" error={this.state.emailError}>
              <TextInput name="email" onDOMChange={event => {this.setState({email: event.target.value});}}/>
            </FormField>
            <FormField label="Password" error={this.state.passwordError}>
              <TextInput type="password" name="password" onDOMChange={event => {this.setState({password: event.target.value});}}/>
            </FormField>

            <FormField error={this.state.agreeError}>
              <CheckBox id='agree'
                name='agree'
                label='I agree with the Terms & Conditions'
                onChange={event => {this.setState({agree: event.target.value})}} />
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center" direction="column">
                <Box justify="center">
                  <Button label='Join depomo'
                    type='submit'
                    primary={true}
                    align="center"
                    style={{width:"100%"}}
                    onClick={function() { console.log("join");}}>

                  </Button>
                </Box>
                {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
                {this.state.errorMessage && <Label style={{color:'red'}}>{this.state.errorMessage}</Label>}
            </Footer>
          </Form>

          <Box justify="center" align="center" colorIndex="light-2">
            <Box justify="center" align="center" margin={{top:"medium"}}>
              <FacebookLogin
                appId="627781417431814"
                cssClass="something"
                autoLoad={true}
                style={{width:"100%"}}
                fields="name,email,picture"
                onClick={this._facebookLogin}
                callback={this._facebookResponse}
                disableMobileRedirect={true}
                icon={<SocialFacebook/>}
                textButton=" Sign up with Facebok"
                size="small"/>
            </Box>

            <Box justify="center" align="center" pad="small">
              <GoogleLogin
                tag="span"
                scope="profile email https://www.googleapis.com/auth/calendar.readonly"
                style={{width:"100%"}}
                clientId="1038035792459-rqukqe4nbf5ksih8i1qlr0ak4689v0ff.apps.googleusercontent.com"
                onSuccess={this._googleLogin}>
                <Button full={true} label="Sign up with Google" icon={<SocialGoogle />} onClick={()=>{console.log("google");}}/>
              </GoogleLogin>
            </Box>
          </Box>
        </Box>
      </Layer>
    )
  }
}, state => ({
  user: state.user
}));
