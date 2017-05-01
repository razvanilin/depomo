import React from 'react';
import { Link, Component } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import LoginForm from 'grommet/components/LoginForm';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';
import Button from 'grommet/components/Button'

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';
import SocialFacebook from 'grommet/components/icons/base/SocialFacebook'
import SocialGoogle from 'grommet/components/icons/base/PlatformGoogle'

import socialLogin from '../actions/socialLogin'

import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'

// actions
import login from '../actions/login'

export default Component({
  componentWillMount() {
    this.state = {
      email: "",
      password: "",
      loading: false,
      emailError: "",
      passwordError: ""
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
    this.setState({loading: true});
    var tempResponse = response.profileObj;
    tempResponse.accessToken = response.accessToken;
    socialLogin(tempResponse, (err, result) => {
      this.setState({loading: false})
    });
  },

  render() {
    return(
      <Layer closer={true} flush={true}>
        <Box pad="medium" align="end" justify="start" alignContent="end">
          <Link to="/"><CloseIcon /></Link>
        </Box>
        <Box direction="column">
          <LoginForm
            title='Login'
            forgotPassword={<Link to="/forgot">Forgot password?</Link>}
            errors={[this.state.emailError, this.state.passwordError, this.state.errorMessage]}
            onSubmit={(credentials) => {

              this.setState({loading: true});
              this.setState({emailError: ""});
              this.setState({passwordError: ""});

              var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
              if (!credentials.username || !credentials.username.match(mailformat)) {
                this.setState({emailError: "Please enter a valid email"});
              }
              if (!credentials.password) {
                this.setState({passwordError: "Please enter your password"});
              }

              if (this.state.emailError || this.state.passwordError) {
                this.setState({loading: false});
                return;
              }

              // set the state
              this.setState({email: credentials.username});
              this.setState({password: credentials.password});

              login({email: credentials.username, password: credentials.password}, null, (success, message) => {
                if (!success) {
                  this.setState({errorMessage: message});
                }

                this.setState({loading: false});
              });
            }}/>

            <Box justify="center" align="center" pad="small">
              <FacebookLogin
                appId="627781417431814"
                cssClass="something"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this._facebookLogin}
                callback={this._facebookResponse}
                disableMobileRedirect={true}
                icon={<SocialFacebook/>}
                textButton=" Login with Facebok"
                size="small"/>
            </Box>

            <Box justify="center" align="center" pad="medium">
              <GoogleLogin
                tag="span"
                style={{}}
                clientId="1038035792459-rqukqe4nbf5ksih8i1qlr0ak4689v0ff.apps.googleusercontent.com"
                onSuccess={this._googleLogin}>
                <Button label="Login with Google" icon={<SocialGoogle />} onClick={()=>{console.log("google");}}/>
              </GoogleLogin>
            </Box>
          </Box>


          {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
      </Layer>
    )
  }
}, state => ({
  user: state.user
}));
