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
import changePassword from '../actions/changePassword'

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
      profileLoading: false,
      passwordLoading: false,
      profileError: "",
      passProfileError: ""
    }
  },

  componentDidMount() {
    if (this.props.user) {
      console.log(this.props.user.name);
    }
  },

  _onSubmitProfileForm() {
    this.setState({profileError: null, emailError: null, nameError: null, profileLoading: true});
    // validation
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!this.state.name) {
      this.setState({nameError: "Please enter your name"});
      this.setState({profileLoading: false})
      return;
    }

    if (this.state.email && !this.state.email.match(mailformat)) {
      this.setState({emailError: "Please enter a valid email"});
      this.setState({profileLoading: false})
      return;
    }

    changeProfile(this.state, this.props.user._id, (success, data) => {
      this.setState({profileLoading: false});

      if (!success) {
        this.setState({profileError: data});
        return;
      }

      this.setState({profileSaved: true, name: "", email: ""});
    })
  },

  _onSubmitPasswordForm() {
    this.setState({passProfileError: "", passwordError: "", newPasswordError: "", passwordLoading: true});

    if (!this.state.password) {
      this.setState({passwordError: "Please enter your current password"});
      this.setState({passwordLoading: false});
      return;
    }
    if (!this.state.newPassword || this.state.newPassword.length < 6) {
      this.setState({newPasswordError: "Your new password must be at least 6 characters long"});
      this.setState({passwordLoading: false});
      return;
    }

    changePassword(this.state, this.props.user._id, (success, data) => {
      this.setState({passwordLoading: false});

      if (!success) {
        this.setState({passProfileError: data});
        return;
      }

      this.setState({passwordChanged: true});
    })
  },

  render() {

    return (
      <Section>
        <Box pad="medium">
          <Heading tag="h3">My Profile</Heading>

          <Form pad="medium" onSubmit={e => { e.preventDefault(); this._onSubmitProfileForm()}}>
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
              <Box pad="small">{this.state.profileLoading && <Spinning />}</Box>
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

          <Form pad="medium" onSubmit={e => { e.preventDefault(); this._onSubmitPasswordForm()}} >
            <FormField label="Current password" error={this.state.passwordError}>
              <TextInput type="password" name="password" onDOMChange={event => {this.setState({password: event.target.value}) }} />
            </FormField>
            <FormField label="New password" error={this.state.newPasswordError}>
              <TextInput type="password" name="newPassword" onDOMChange={event => {this.setState({newPassword: event.target.value}) }} />
            </FormField>

            <Footer pad={{"vertical": "medium"}}>
              <Button type="submit" primary={true} label="Save password" onClick={() => console.log("Saving password...")}/>
              <Box pad="small">{this.state.passwordLoading && <Spinning />}</Box>
            </Footer>
          </Form>

          {this.state.passwordChanged &&
            <Toast status="ok" onClose={()=>{this.setState({passwordChanged: false}) }}>
              Oh yes! Your password was changed 😼
            </Toast>
          }

          {this.state.passProfileError &&
            <Toast status="critical" onClose={()=>{this.setState({passProfileError: false}) }}>
              Oh no! 🙀 There was an error: <i>{this.state.passProfileError}</i>
            </Toast>
          }
        </Box>
      </Section>
    )
  }
}, state => ({
  user: state.user
}))
