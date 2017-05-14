import React from 'react'
import { Component } from 'jumpsuit'

import Box from 'grommet/components/Box'
import CheckBox from 'grommet/components/CheckBox'
import NumberInput from 'grommet/components/NumberInput'
import RadioButton from 'grommet/components/RadioButton'
import Notification from 'grommet/components/Notification'
import Button from 'grommet/components/Button'
import FormField from 'grommet/components/FormField'
import Spinning from 'grommet/components/icons/Spinning'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'

import notifications from '../actions/notifications'
import changeProfile from '../actions/changeProfile'

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export default Component({
  componentWillMount() {
    this.state = {
      error: false,
      success: false,
      loading: false,
      user: {
        reminderNotification: false,
        reminderOffset: false,
        offsetType: "minutes"
      }
    }

    // check to see if this is accessed while the user is logged in
    if (!getQueryStringValue('token') && this.props.user && this.props.user._id) {
      this.setState({
        user: {
          reminderOffset: this.props.user.reminderOffset,
          reminderNotification: this.props.user.reminderNotification,
          offsetType: 'minutes'
        }
      });
    } else {
      notifications.getNotificationPreferences(getQueryStringValue('token'), (err, response) => {
        if (err) {console.log(err);return;}
        console.log(response);
        response.offsetType = 'minutes';
        this.setState({user: response});
      });
    }
  },

  _saveNotificationPreferences() {
    this.setState({loading: true});

    var resource;
    if (getQueryStringValue('token')) {
      notifications.updateNotificationPreferences(getQueryStringValue('token'), this.state.user, (err, response) => {
        if (err) this.setState({error: err});
        else this.setState({success: true});
        console.log(response);
        this.setState({loading: false});
      });
    } else {
      changeProfile(this.state.user, this.props.user._id, (success, data) => {
        if (!success) this.setState({error: data});
        else this.setState({success: true});
        console.log(data);
        this.setState({loading: false});
      });
    }
  },

  render() {
    return(
        <Form pad="medium">
          <FormField>
          <CheckBox label="Get reminders for your tasks" checked={this.state.user.reminderNotification}
            toggle={true}
            onChange={event => {
              var user = this.state.user;
              user.reminderNotification = !user.reminderNotification;
              console.log(user);
              this.setState({user: user});
            }} />
          </FormField>

          <Box justify="center" align="center" responsive={true} margin={{top:"medium", bottom:"medium"}}>
            <FormField label="Send reminder">
            <NumberInput min={1}
              value={parseInt(this.state.user.reminderOffset, 10)}
              disabled={!this.state.user.reminderNotification}
              onChange={event => {
                var user = this.state.user;
                user.reminderOffset = event.target.value;
                this.setState({user: user});
              }} />

            <RadioButton checked={this.state.user.offsetType === 'minutes'} value="minutes"
              id="radio-minutes"
              disabled={!this.state.user.reminderNotification}
              label="minutes"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            <RadioButton checked={this.state.user.offsetType === 'hours'} value="hours"
              id="radio-hours"
              disabled={!this.state.user.reminderNotification}
              label="hours"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            <RadioButton checked={this.state.user.offsetType === 'days'} value="days"
              id="radio-days"
              disabled={!this.state.user.reminderNotification}
              label="days"
              onChange={event => {
                var user = this.state.user;
                user.offsetType = event.target.value;
                this.setState({user: user});
              }} />
            </FormField>
          </Box>

          <Footer margin={{bottom:"large"}}>
            <Button label="Save" primary={true} onClick={() => this._saveNotificationPreferences()} />
          </Footer>

          {this.state.loading && <Box justify="center" align="center" pad="small"><Spinning /></Box>}
          {this.state.error &&
            <Notification size="small" status="critical" message="Oh no! 🙀" state="There was an error while updating your profile. Please try again." />
          }
          {this.state.success &&
            <Notification size="small" status="ok" message="Success! 😺" state="Your settings have been updated." />
          }

        </Form>
    )
  }
}, state =>({
  user: state.user
}))
