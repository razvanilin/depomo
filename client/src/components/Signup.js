import React from 'react';
import { Component, Link, Goto } from 'jumpsuit';
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
import Columns from 'grommet/components/Columns';
import Spinning from 'grommet/components/icons/Spinning';

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';

// actions
import signup from '../actions/signup';

export default Component({
  componentWillMount() {
    this.errors = {};
    this.loading = false;
    if (this.props.user && this.props.user.user && this.props.user.user._id) {
      Goto({
        path: "/"
      });
    }
  },
  render() {
    let credentials = {};
    return(
      <Layer closer={true} flush={true}>
        <Box pad="medium" align="end" justify="start" alignContent="end">
          <Link to="/"><CloseIcon /></Link>
        </Box>
        <Box align="center" justify="center">
          <Form pad="medium" onSubmit={e => {
            e.preventDefault();

            // validation
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            this.errors = {};
            this.loading = true;

            if (!credentials.name || credentials.name.length < 1) {
              this.errors.name = "Please enter your name.";
              this.loading = false;
            }
            if (!credentials.email || !credentials.email.match(mailformat)) {
              this.errors.email = "Please enter a valid email.";
              this.loading = false;
            }
            if (!credentials.password || credentials.password.length < 6) {
              this.errors.password = "Please enter a password that's longer than 6 characters.";
              this.loading = false;
            }
            if (!credentials.agree) {
              this.errors.agree = " ";
              this.loading = false;
            }

            signup(credentials);
          }}>
            <Header align="center" justify="center">
              <Heading strong={true} align="center">
                Signup
              </Heading>
            </Header>

            <FormField label="Name" error={this.errors.name}>
              <TextInput name="name" onDOMChange={event => {credentials.name = event.target.value}}/>
            </FormField>
            <FormField label="Email" error={this.errors.email}>
              <TextInput name="email" onDOMChange={event => {credentials.email = event.target.value}}/>
            </FormField>
            <FormField label="Password" error={this.errors.password}>
              <TextInput type="password" name="password" onDOMChange={event => {credentials.password = event.target.value}}/>
            </FormField>

            <FormField error={this.errors.agree}>
              <CheckBox id='agree'
                name='agree'
                label='I agree with the Terms & Conditions' />
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center">
              <Columns justify="center">
                <Box justify="center">
                  <Button label='Join depomo'
                    type='submit'
                    primary={true}
                    align="center"
                    style={{width:"100%"}}
                    onClick={function() { console.log("join");}}>

                  </Button>
                </Box>

                {this.loading && <Box justify="center" align="center" pad="small"><Spinning align="center" /></Box>}
              </Columns>
            </Footer>
          </Form>
        </Box>
      </Layer>
    )
  }
}, state => ({
  user: state.user,
  routing: state.routing
}));
