import React from 'react';
import { Link, Component } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import LoginForm from 'grommet/components/LoginForm';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';
import SocialFacebook from 'grommet/components/icons/base/SocialFacebook'

import socialLogin from '../actions/socialLogin'

import FacebookLogin from 'react-facebook-login'

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
    this.setState({facebookLoading: true});
  },

  _facebookResponse(response) {
    socialLogin(response, (err, result) => {
      this.setState({facebookLoading: false});
      console.log(response);
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

            <Box justify="center" align="center" pad="medium">
              <FacebookLogin
                appId="627781417431814"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this._facebookLogin}
                callback={this._facebookResponse}
                disableMobileRedirect={true}
                icon={<SocialFacebook/>}
                textButton=" Login with Facebok"
                size="small"/>
            </Box>
          </Box>


          {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
      </Layer>
    )
  }
}, state => ({
  user: state.user
}));
