import React from 'react'

import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Columns from 'grommet/components/Columns'
import Footer from 'grommet/components/Footer'
import TextInput from 'grommet/components/TextInput'
import Label from 'grommet/components/Label'
import Spinning from 'grommet/components/icons/Spinning'
import Toast from 'grommet/components/Toast'
import Responsive from 'grommet/utils/Responsive'
import SocialShare from 'grommet/components/SocialShare'

import subscribeEmail from '../actions/subscribeEmail'

export default React.createClass({
  componentWillMount() {
    this.state = {
      email: "",
      emailError: "",
      errorMessage: "",
      loading: false,
      toastOpen: false
    };
  },

  componentDidMount() {
    this._responsive = Responsive.start(this._onResponsive);
  },

  componentWillUnmout() {
    this._responsive.stop();
  },

  _onResponsive(small) {
    if (small && !this.state.isMobile) {
      this.setState({isMobile: true});
    } else if (!small && this.state.isMobile) {
      this.setState({isMobile: false});
    }
  },

  _onSubmitForm() {
    this.setState({loading: true});
    this.setState({emailError: ""});
    this.setState({errorMessage: ""});
    this.setState({success: false});

    if (!this.state.email) {
      this.setState({errors: {email: "Please enter a valid email"}});
      this.setState({loading: false});
      return;
    }

    subscribeEmail(this.state.email, (success, error) => {
      if (!success) this.setState({errorMessage: error});

      this.setState({loading: false});
      this.setState({email: ""});
      this.setState({success: success});
    });
  },

  render() {
    return (
      <Form compact={this.state.isMobile} onSubmit={e => {e.preventDefault(); this._onSubmitForm()}}>
            <Heading align="center" tag="h3">{"Beta registration is now open 🎉"}</Heading>
        <FormField style={{backgroundColor: "white"}} error={this.state.emailError}>
          <TextInput style={{color: "black"}} placeHolder="Enter your Email" name="email" value={this.state.email} onDOMChange={event => {this.setState({email: event.target.value})}} />
        </FormField>

        <Footer pad={{"vertical": "medium"}} justify="center">
          <Columns justify="center">
            <Box justify="center">
              <Button label="Count me in"
                type='submit'
                primary={true}
                align="center"
                style={{width:"100%"}}
                onClick={function() { console.log("change");}}>
              </Button>
            </Box>

            {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
            {this.state.errorMessage && <Label style={{color:'red'}}>{this.state.errorMessage}</Label>}
            {this.state.success &&
              <Toast message='Thank you for registering! 😻 The beta will start soon' status='ok' onClose={() => {this.setState({success: false})}}>
                <Box direction="row">
                  <Label>Thank you for registering! 😻 The beta will start soon. Share this on Twitter
                    <SocialShare type="twitter" link="https://depomo.com" text="A new way to get rid of procrastination 🙀 I just registered for the beta here: "/>
                  </Label>
                </Box>
              </Toast>
            }
          </Columns>
        </Footer>
      </Form>
    )
  }
})
