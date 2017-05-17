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
import Notification from 'grommet/components/Notification'
import Responsive from 'grommet/utils/Responsive'

import subscribeEmail from '../actions/subscribeEmail'

export default React.createClass({
  componentWillMount() {
    this.state = {
      email: "",
      emailError: "",
      errorMessage: "",
      loading: false
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
            <Heading align="center" tag="h3">{"Beta registrations are now open 🎉"}</Heading>
        <FormField label="Enter your email to be one of the first one to try it" error={this.state.emailError}>
          <TextInput name="email" value={this.state.email} onDOMChange={event => {this.setState({email: event.target.value})}} />
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
            {this.state.success && <Notification message='Thank you for registering! 😻 The beta will start soon' status='ok' />}
          </Columns>
        </Footer>
      </Form>
    )
  }
})
