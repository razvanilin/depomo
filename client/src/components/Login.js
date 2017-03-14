import React from 'react';
import { Link, Component, Goto } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import Anchor from 'grommet/components/Anchor';
import LoginForm from 'grommet/components/LoginForm';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';

// actions
import login from '../actions/login'

export default Component({
  componentWillMount() {
    this.errors = {};
    this.loading = false;

    if (this.props.user && this.props.user._id) {
      Goto({
        path: "/"
      });
    }
  },
  render() {
    return(
      <Layer closer={true} flush={true}>
        <Box pad="medium" align="end" justify="start" alignContent="end">
          <Link to="/"><CloseIcon /></Link>
        </Box>
        <Box>
        <LoginForm
          title='Login'
          forgotPassword={<Anchor href='#'
          label='Forgot password?' />}
          errors={[this.errors.username, this.errors.password, this.props.user.error]}
          onSubmit={(credentials) => {
            this.errors = {};
            this.loading = true;

            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!credentials.username || !credentials.username.match(mailformat)) {
              this.errors.username = "Please enter a valid email";
              this.loading = false;
            }
            if (!credentials.password) {
              this.errors.password = "Please enter your password";
              this.loading = false;
            }

            login(credentials);
          }}/>
          </Box>
          {this.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
      </Layer>
    )
  }
}, state => ({
  user: state.user
}));
