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
import Select from 'grommet/components/Select'

import changeProfile from '../actions/changeProfile'
import changePassword from '../actions/changePassword'

export default Component({
  componentWillMount() {
    this.state = {
      name: "",
      email: "",
      timezone: "",
      timezoneLabel: "",
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

  _renderTimezones() {
    return (
      <FormField>
        <Select placeHolder={this.props.user.timezone}
          options={[{
            value: "Pacific/Midway (UTC -11:00)",
            sub: "-11:00",
            "label": <Box direction='row' justify='between'><span>Pacific/Midway</span><span className='secondary'>UTC -11:00</span></Box>
          },{
            value: "Pacific/Pago Pago (UTC -11:00)",
            sub: "-11:00",
            "label": <Box direction='row' justify='between'><span>Pacific/Pago Pago</span><span className='secondary'>UTC -11:00</span></Box>
          },{
            value: "Pacific/Honolulu (UTC -10:00)",
            sub: "-10:00",
            "label": <Box direction='row' justify='between'><span>Pacific/Honolulu</span><span className='secondary'>UTC -10:00</span></Box>
          },{
            value: "America/Juneau (UTC -8:00)",
            sub: "-8:00",
            "label": <Box direction='row' justify='between'><span>America/Juneau</span><span className='secondary'>UTC -8:00</span></Box>
          },{
            value: "America/Tijuana (UTC -7:00)",
            sub: "-7:00",
            "label": <Box direction='row' justify='between'><span>America/Tijuana</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Phoenix (UTC -7:00)",
            sub: "-7:00",
            "label": <Box direction='row' justify='between'><span>America/Phoenix</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Los Angeles (UTC -7:00)",
            sub: "-7:00",
            "label": <Box direction='row' justify='between'><span>America/Los Angeles</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Regina (UTC -6:00)",
            sub: "-6:00",
            "label": <Box direction='row' justify='between'><span>America/Regina</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Denver (UTC -6:00)",
            sub: "-6:00",
            "label": <Box direction='row' justify='between'><span>America/Denver</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Guatemala (UTC -6:00)",
            sub: "-6:00",
            "label": <Box direction='row' justify='between'><span>America/Guatemala</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Mazatlan (UTC -6:00)",
            sub: "-6:00",
            "label": <Box direction='row' justify='between'><span>America/Mazatlan</span><span className='secondary'>UTC -6:00</span></Box>
          }]}
          value={this.state.timezone}
          onChange={(target) => {this.setState({timezone: target.option.sub})}}
        />
      </FormField>
    )
  },

  render() {

    return (
      <Section>
        <Box pad="medium">
          <Heading tag="h3">My Profile</Heading>

          <Form pad="medium" onSubmit={e => { e.preventDefault(); this._onSubmitProfileForm()}}>
            <FormField label="Your name" error={this.state.nameError}>
              <TextInput placeHolder={this.props.user.name} name="name" value={this.state.name} onDOMChange={event => { this.setState({name: event.target.value}) }} />
            </FormField>
            <FormField label="Your email" error={this.state.emailError}>
              <TextInput placeHolder={this.props.user.email} name="email" value={this.state.email} onDOMChange={event => { this.setState({email: event.target.value}) }} />
            </FormField>
            {this._renderTimezones()}

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
