import React from 'react'
import { Component } from 'jumpsuit'

import Section from 'grommet/components/Section'
import Box from 'grommet/components/Box'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Heading from 'grommet/components/Heading'
import Spinning from 'grommet/components/icons/Spinning'
import Toast from 'grommet/components/Toast'
import Label from 'grommet/components/Label'

import changeProfile from '../actions/changeProfile'

export default Component({
  componentWillMount() {
    this.state = {
      name: "",
      email: "",
      password: "",
      newPassword: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      newPasswordError: "",
      loading: false,
      profileError: "",
      passProfileError: ""
    }
  },

  componentDidMount() {
    if (this.props.user) {
      console.log(this.props.user.name);
    }
  },

  _onSubmitForm() {
    this.setState({profileError: null, emailError: null, nameError: null, loading: true});
    // validation
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!this.state.name) this.setState({nameError: "Please enter your name"});
    if (!this.state.email || !this.state.email.match(mailformat)) this.setState({emailError: "Please enter a valid email"});
    if (this.state.nameError || this.state.emailError) {
      this.setState({loading: false})
      return;
    }

    changeProfile(this.state, this.props.user._id, (success, data) => {
      this.setState({loading: false});

      if (!success) {
        this.setState({profileError: data});
        return;
      }

      this.setState({profileSaved: true, name: "", email: ""});
    })
  },

  render() {

    return (
      <Section>
        <Box pad="medium">
          <Heading tag="h3">My Profile</Heading>

          <Form pad="medium" onSubmit={e => { e.preventDefault(); this._onSubmitForm()}}>
            <FormField label="Your name" error={this.state.nameError}>
              <TextInput name="name" value={this.state.name} onDOMChange={event => { this.setState({name: event.target.value}) }} />
              <Label style={{paddingLeft:"20px"}}>{this.props.user.name}</Label>
            </FormField>
            <FormField label="Your email" error={this.state.emailError}>
              <TextInput name="email" value={this.state.email} onDOMChange={event => { this.setState({email: event.target.value}) }} />
              <Label style={{paddingLeft:"20px"}}>{this.props.user.email}</Label>
            </FormField>

            <Footer pad={{"vertical": "medium"}}>
              <Button type="submit" primary={true} label="Save profile" onClick={() => console.log("Saving profile")}/>
              <Box pad="small">{this.state.loading && <Spinning />}</Box>
            </Footer>
          </Form>

          {this.state.profileSaved &&
            <Toast status="ok" onClose={()=>{this.setState({profileSaved: false}) }}>
              Woohoo! Your profile was saved 🤘🏻
            </Toast>
          }

          {this.state.profileError &&
            <Toast status="critical" onClose={()=>{this.setState({profileError: false}) }}>
              Oh no! There was an error while saving your profile 🙀 Please try again
            </Toast>
          }
        </Box>

        <Box pad="medium">
          <Heading tag="h3">Change Password</Heading>
        </Box>
      </Section>
    )
  }
}, state => ({
  user: state.user
}))
