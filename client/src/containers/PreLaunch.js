import React from 'react'

import './App.scss';
import '../index.scss';

import DepomoSmile from '../images/depomo_smile.png';

import App from 'grommet/components/App'
import Header from 'grommet/components/Header'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Image from 'grommet/components/Image';
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Columns from 'grommet/components/Columns'
import Headline from 'grommet/components/Headline'
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
      <App>
            <Box pad="medium" full={true} justify="center" align="center">
              <Image size={this.state.isMobile ? "small" : "medium"} src={DepomoSmile}/>

              <Headline>Depomo is coming soon...</Headline>
              <Box direction={this.state.isMobile ? 'column' : 'row'} justify="center" align="center">
                <Form compact={this.state.isMobile} onSubmit={e => {e.preventDefault(); this._onSubmitForm()}}>
                  { !this.state.isMobile &&
                    <Header>
                      <Heading strong={true} tag="h3">{"Become part of Depomo's story"}</Heading>
                      </Header>
                  }
                  <FormField label="Get the latest updates on your email" error={this.state.emailError}>
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
                      {this.state.success && <Notification message='Thank you for subscribing! 😻' status='ok' />}
                    </Columns>
                  </Footer>
                </Form>
              </Box>
            </Box>
      </App>
    )
  }
})
//
// <div className='App'>
//   <div className='App-header'>
//     <img src={logo} className='App-logo' alt='logo' />
//     <h2>Welcome to React + Jumpsuit!</h2>
//   </div>
//   {this.props.children}
// </div>
