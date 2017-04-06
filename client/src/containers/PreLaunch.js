import React from 'react'

import './App.scss';
import '../index.scss';

import HeaderImage from '../images/classroom.jpg';
import DepomoLogo from '../images/depomo_logo_mod.png';
import DepomoSmile from '../images/depomo_smile.png';
import DepomoConfused from '../images/depomo_confused.png';

import App from 'grommet/components/App'
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Hero from 'grommet/components/Hero'
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
import Section from 'grommet/components/Section'
import Spinning from 'grommet/components/icons/Spinning'
import Paragraph from 'grommet/components/Paragraph'
import Notification from 'grommet/components/Notification'

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
      <App centered={false}>
        <Article colorIndex="accent-1-a">
          <Hero background={<Image src={HeaderImage}
            fit='cover'
            full={true}
            align={{"bottom": true}} />}
            backgroundColorIndex='dark'
            size="medium">
            <Box align="end" pad="medium" basis="1/2"/>
            <Box direction='column'
              basis="1/2"
              justify='center'
              align='center'>
                <Headline margin='none'>
                  <Image size="large" src={DepomoLogo}/>
                </Headline>
                <Heading style={{textShadow: "3px 3px 5px #000000"}} strong={true} tag="h3">
                  Help children get educated while breaking procrastination in your daily activities
                </Heading>
            </Box>

            <Box full="horizontal" direction="row" justify="center" align="center">
            </Box>
          </Hero>

          <Section>
            <Box direction="row" justify="center" align="start" pad={{horizontal: "large"}}>
              <Form pad="medium" onSubmit={e => {e.preventDefault(); this._onSubmitForm()}}>
                <Header justify="center" align="center">
                  <Heading strong={true} tag="h3">{"Become part of Depomo's story"}</Heading>
                </Header>
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
              <Image size="medium" src={DepomoSmile}/>
            </Box>

            <Box direction="row" justify="center" align="start" pad={{horizontal: "large"}}>
              <Image size="medium" src={DepomoConfused}/>
              <Box direction="column" justify="center" align="start">
                <Heading strong={true} tag="h3">What will Depomo be</Heading>
                <Paragraph size="large">
                  A task-based platform that will help users break procrastination by placing deposits for each task.
                </Paragraph>
                <Paragraph size="large">
                  When the taks is not completed, the deposit will go towards helping poor regions in africa develop their education system and help children to study.
                </Paragraph>
                <Paragraph size="large">
                  Register for updates to be the first one who gets notified about future developments.
                </Paragraph>
              </Box>
            </Box>
          </Section>
        </Article>
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
