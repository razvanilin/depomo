import React from 'react'
import { Component } from 'jumpsuit'

import LogoImage from '../images/depomo_logo.png';

import Heading from 'grommet/components/Heading'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Image from 'grommet/components/Image'
import HomeIcon from 'grommet/components/icons/base/Home'
import CheckBox from 'grommet/components/CheckBox'
import NumberInput from 'grommet/components/NumberInput'
import RadioButton from 'grommet/components/RadioButton'
import Notification from 'grommet/components/Notification'
import Button from 'grommet/components/Button'
import FormField from 'grommet/components/FormField'

import notifications from '../actions/notifications'

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export default Component({
  componentWillMount() {
    this.state = {
      error: false,
      success: false,
      user: {
        reminderNotification: false,
        reminderOffset: false,
        offsetType: "minutes"
      }
    }

    notifications.getNotificationPreferences(getQueryStringValue('token'), (err, response) => {
      if (err) return;

      this.setState({user: response});
    });
  },

  _saveNotificationPreferences() {
    notifications.updateNotificationPreferences(getQueryStringValue('token'), this.state.user, (err) => {
      if (err) this.setState({error: err});
    });
  },

  render() {
    return(
      <Box pad="large" justify="center" align="center" direction="column">
        <Image size="large" src={LogoImage}/>

        <Heading tag="h2">Update your Depomo subscriptions 📰</Heading>

        <Box direction="column" justify="start" align="start">
          <FormField>
          <CheckBox label="Get reminders for your tasks" value={this.state.user.reminderNotification}
            onChange={event => {
              var user = this.state.user;
              user.reminderNotification = event.target.value === 'true';
              this.setState({user: user});
            }} />
          </FormField>

          <Box style={{width:"100%"}} margin={{top:"medium", bottom:"medium"}}>
            <FormField label="Send reminder">
            <NumberInput min={1}
              disabled={this.state.user.reminderNotification}
              onChange={event => {
                var user = this.state.user;
                user.reminderOffset = event.target.value;
                this.setState({user: user});
              }} />

            <RadioButton checked={this.state.user.offsetType === 'minutes'} value="minutes"
              id="radio-minutes"
              disabled={this.state.user.reminderNotification}
              label="minutes"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            <RadioButton checked={this.state.user.offsetType === 'hours'} value="hours"
              id="radio-hours"
              disabled={this.state.user.reminderNotification}
              label="hours"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            <RadioButton checked={this.state.user.offsetType === 'days'} value="days"
              id="radio-days"
              disabled={this.state.user.reminderNotification}
              label="days"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            </FormField>
          </Box>

          <Box margin={{bottom:"medium"}} justify="center" align="center">
            <Button fill={true} label="Save" primary={true} onClick={() => this._saveNotificationPreferences} />
          </Box>

          {this.state.error &&
            <Notification state="Oh no! 🙀" message="There was an error while updating your profile. Please try again." />
          }
          {this.state.success &&
            <Notification state="Success! 😺" message="Your settings have been updated." />
          }

        </Box>

        <Anchor primary={true} label="Go back to the main page" animateIcon={true} icon={<HomeIcon />} path={{path: "/"}} />
      </Box>
    )
  }
}, state =>({
  user: state.user
}))
