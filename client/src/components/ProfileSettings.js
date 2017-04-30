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

    // if (!this.state.name) {
    //   this.setState({nameError: "Please enter your name"});
    //   this.setState({profileLoading: false})
    //   return;
    // }

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
            sub: "-1100",
            "label": <Box direction='row' justify='between'><span>Pacific/Midway</span><span className='secondary'>UTC -11:00</span></Box>
          },{
            value: "Pacific/Pago Pago (UTC -11:00)",
            sub: "-1100",
            "label": <Box direction='row' justify='between'><span>Pacific/Pago Pago</span><span className='secondary'>UTC -11:00</span></Box>
          },{
            value: "Pacific/Honolulu (UTC -10:00)",
            sub: "-1000",
            "label": <Box direction='row' justify='between'><span>Pacific/Honolulu</span><span className='secondary'>UTC -10:00</span></Box>
          },{
            value: "America/Juneau (UTC -8:00)",
            sub: "-0800",
            "label": <Box direction='row' justify='between'><span>America/Juneau</span><span className='secondary'>UTC -8:00</span></Box>
          },{
            value: "America/Tijuana (UTC -7:00)",
            sub: "-0700",
            "label": <Box direction='row' justify='between'><span>America/Tijuana</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Phoenix (UTC -7:00)",
            sub: "-0700",
            "label": <Box direction='row' justify='between'><span>America/Phoenix</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Los Angeles (UTC -7:00)",
            sub: "-0700",
            "label": <Box direction='row' justify='between'><span>America/Los Angeles</span><span className='secondary'>UTC -7:00</span></Box>
          },{
            value: "America/Regina (UTC -6:00)",
            sub: "-0600",
            "label": <Box direction='row' justify='between'><span>America/Regina</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Denver (UTC -6:00)",
            sub: "-0600",
            "label": <Box direction='row' justify='between'><span>America/Denver</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Guatemala (UTC -6:00)",
            sub: "-0600",
            "label": <Box direction='row' justify='between'><span>America/Guatemala</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Mazatlan (UTC -6:00)",
            sub: "-0600",
            "label": <Box direction='row' justify='between'><span>America/Mazatlan</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Chihuahua (UTC -6:00)",
            sub: "-0600",
            "label": <Box direction='row' justify='between'><span>America/Chihuahua</span><span className='secondary'>UTC -6:00</span></Box>
          },{
            value: "America/Mexico City (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Mexico City</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Chicago (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Chicago</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Bogota (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Bogota</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Rio Branco (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Rio Branco</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Monterrey (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Monterrey</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Lima (UTC -5:00)",
            sub: "-0500",
            "label": <Box direction='row' justify='between'><span>America/Lima</span><span className='secondary'>UTC -5:00</span></Box>
          },{
            value: "America/Caracas (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Caracas</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/La Paz (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/La Paz</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Indiana/Indianapolis (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Indiana/Indianapolis</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Santo Domingo (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Santo Domingo</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Campo Grande (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Campo Grande</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Manaus (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Manaus</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/New York (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/New York</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Cuiaba (UTC -4:00)",
            sub: "-0400",
            "label": <Box direction='row' justify='between'><span>America/Cuiaba</span><span className='secondary'>UTC -4:00</span></Box>
          },{
            value: "America/Montevideo (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Montevideo</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/Argentina/Buenos Aires (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Argentina/Buenos Aires</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/Santiago (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Santiago</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/Bermuda (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Bermuda</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/São Paulo (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/São Paulo</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/Halifax (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Halifax</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/Belem (UTC -3:00)",
            sub: "-0300",
            "label": <Box direction='row' justify='between'><span>America/Belem</span><span className='secondary'>UTC -3:00</span></Box>
          },{
            value: "America/South Georgia (UTC -2:00)",
            sub: "-0200",
            "label": <Box direction='row' justify='between'><span>America/South Georgia</span><span className='secondary'>UTC -2:00</span></Box>
          },{
            value: "America/Godthab (UTC -2:00)",
            sub: "-0200",
            "label": <Box direction='row' justify='between'><span>America/Godthab</span><span className='secondary'>UTC -2:00</span></Box>
          },{
            value: "America/Cape Verde (UTC -1:00)",
            sub: "-0100",
            "label": <Box direction='row' justify='between'><span>America/Cape Verde</span><span className='secondary'>UTC -1:00</span></Box>
          },{
            value: "Iceland (UTC 0:00)",
            sub: "0:00",
            "label": <Box direction='row' justify='between'><span>Iceland</span><span className='secondary'>UTC 0:00</span></Box>
          },{
            value: "Africa/Monrovia (UTC 0:00)",
            sub: "0:00",
            "label": <Box direction='row' justify='between'><span>Africa/Monrovia</span><span className='secondary'>UTC 0:00</span></Box>
          },{
            value: "Africa/Azores (UTC 0:00)",
            sub: "0:00",
            "label": <Box direction='row' justify='between'><span>Africa/Azores</span><span className='secondary'>UTC 0:00</span></Box>
          },{
            value: "Africa/Casablanca (UTC +1:00)",
            sub: "+0100",
            "label": <Box direction='row' justify='between'><span>Africa/Casablanca</span><span className='secondary'>UTC +1:00</span></Box>
          },{
            value: "Europe/Dublin (UTC +1:00)",
            sub: "+0100",
            "label": <Box direction='row' justify='between'><span>Europe/Dublin</span><span className='secondary'>UTC +1:00</span></Box>
          },{
            value: "Europe/London (UTC +1:00)",
            sub: "+0100",
            "label": <Box direction='row' justify='between'><span>Europe/London</span><span className='secondary'>UTC +1:00</span></Box>
          },{
            value: "Europe/Lisbon (UTC +1:00)",
            sub: "+0100",
            "label": <Box direction='row' justify='between'><span>Europe/Lisbon</span><span className='secondary'>UTC +1:00</span></Box>
          },{
            value: "Europe/Amsterdam (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Amsterdam</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Africa/Harare (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Africa/Harare</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Budapest (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Budapest</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Vienna (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Vienna</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Copenhagen (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Copenhagen</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Stockholm (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Stockholm</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Bratislava (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Bratislava</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Skopje (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Skopje</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Berlin (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Berlin</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Rome (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Rome</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Africa/Johannesburg (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Africa/Johannesburg</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Warsaw (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Warsaw</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Prague (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Prague</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Paris (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Paris</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Oslo (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Oslo</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Belgrade (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Belgrade</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Brussels (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Brossels</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Zagreb (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Zagreb</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Ljubljana (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Ljubljana</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Africa/Cairo (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Africa/Cairo</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Madrid (UTC +2:00)",
            sub: "+0200",
            "label": <Box direction='row' justify='between'><span>Europe/Madrid</span><span className='secondary'>UTC +2:00</span></Box>
          },{
            value: "Europe/Helsinki (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Helsinki</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Minsk (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Minsk</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Africa/Nairobi (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Africa/Nairobi</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Asia/Baghdad (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Asia/Baghdad</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Moscow (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Moscow</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Asia/Ryadh (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Asia/Ryadh</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Riga (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Riga</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Kiev (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Kiev</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Asia/Kuwait (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Asia/Kuwait</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Instanbul (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Instanbul</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Vilnius (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Vilnius</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Sofia (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Sofia</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Talinn (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Talinn</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Asia/Jerusalem (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Asia/Jerusalem</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Europe/Bucharest (UTC +3:00)",
            sub: "+0300",
            "label": <Box direction='row' justify='between'><span>Europe/Bucharest</span><span className='secondary'>UTC +3:00</span></Box>
          },{
            value: "Asia/Muscat (UTC +4:00)",
            sub: "+0400",
            "label": <Box direction='row' justify='between'><span>Asia/Muscat</span><span className='secondary'>UTC +4:00</span></Box>
          },{
            value: "Indian/Mauritius (UTC +4:00)",
            sub: "+0400",
            "label": <Box direction='row' justify='between'><span>Indian/Mauritius</span><span className='secondary'>UTC +4:00</span></Box>
          },{
            value: "Asia/Baku (UTC +4:00)",
            sub: "+0400",
            "label": <Box direction='row' justify='between'><span>Asia/Baku</span><span className='secondary'>UTC +4:00</span></Box>
          },{
            value: "Asia/Yerevan (UTC +4:00)",
            sub: "+0400",
            "label": <Box direction='row' justify='between'><span>Asia/Yerevan</span><span className='secondary'>UTC +4:00</span></Box>
          },{
            value: "Asia/Tbilisi (UTC +4:00)",
            sub: "+0400",
            "label": <Box direction='row' justify='between'><span>Asia/Tbilisi</span><span className='secondary'>UTC +4:00</span></Box>
          },{
            value: "Asia/Yekaterinburgh (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Yekaterinburgh</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Tashkent (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Tashkent</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Karachi (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Karachi</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Yekaterinburgh (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Yekaterinburgh</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Tashkent (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Tashkent</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Karachi (UTC +5:00)",
            sub: "+0500",
            "label": <Box direction='row' justify='between'><span>Asia/Karachi</span><span className='secondary'>UTC +5:00</span></Box>
          },{
            value: "Asia/Colombo (UTC +5:30)",
            sub: "+0530",
            "label": <Box direction='row' justify='between'><span>Asia/Colombo</span><span className='secondary'>UTC +5:30</span></Box>
          },{
            value: "Asia/Kolkata (UTC +5:30)",
            sub: "+0530",
            "label": <Box direction='row' justify='between'><span>Asia/Kolkata</span><span className='secondary'>UTC +5:30</span></Box>
          },{
            value: "Asia/Katmandu (UTC +5:45)",
            sub: "+0545",
            "label": <Box direction='row' justify='between'><span>Asia/Katmandu</span><span className='secondary'>UTC +5:45</span></Box>
          },{
            value: "Asia/Almaty (UTC +6:00)",
            sub: "+0600",
            "label": <Box direction='row' justify='between'><span>Asia/Almaty</span><span className='secondary'>UTC +6:00</span></Box>
          },{
            value: "Asia/Urumqi (UTC +6:00)",
            sub: "+0600",
            "label": <Box direction='row' justify='between'><span>Asia/Urumqi</span><span className='secondary'>UTC +6:00</span></Box>
          },{
            value: "Asia/Dhaka (UTC +6:00)",
            sub: "+0600",
            "label": <Box direction='row' justify='between'><span>Asia/Dhaka</span><span className='secondary'>UTC +6:00</span></Box>
          },{
            value: "Asia/Rangoon (UTC +6:30)",
            sub: "+0630",
            "label": <Box direction='row' justify='between'><span>Asia/Rangoon</span><span className='secondary'>UTC +6:30</span></Box>
          },{
            value: "Asia/Krasnoyarsk (UTC +7:00)",
            sub: "+0700",
            "label": <Box direction='row' justify='between'><span>Asia/Krasnoyarsk</span><span className='secondary'>UTC +7:00</span></Box>
          },{
            value: "Asia/Jakarta (UTC +7:00)",
            sub: "+0700",
            "label": <Box direction='row' justify='between'><span>Asia/Jakarata</span><span className='secondary'>UTC +7:00</span></Box>
          },{
            value: "Asia/Jakarta (UTC +7:00)",
            sub: "+0700",
            "label": <Box direction='row' justify='between'><span>Asia/Jakarata</span><span className='secondary'>UTC +7:00</span></Box>
          },{
            value: "Asia/Bangkok (UTC +7:00)",
            sub: "+0700",
            "label": <Box direction='row' justify='between'><span>Asia/Bangkok</span><span className='secondary'>UTC +7:00</span></Box>
          },{
            value: "Asia/Novosibirsk (UTC +7:00)",
            sub: "+0700",
            "label": <Box direction='row' justify='between'><span>Asia/Novosibirsk</span><span className='secondary'>UTC +7:00</span></Box>
          },{
            value: "Asia/Kuala Lumpur (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Kuala Lumpur</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Hong Kong (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Hong Kong</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Australia/Perth (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Australia/Perth</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Taipei (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Taipei</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Singapore (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Singapore</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Shanghai (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Shanghai</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Irkutsk (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Irkutsk</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Chongqing (UTC +8:00)",
            sub: "+0800",
            "label": <Box direction='row' justify='between'><span>Asia/Chongqing</span><span className='secondary'>UTC +8:00</span></Box>
          },{
            value: "Asia/Seoul (UTC +9:00)",
            sub: "+0900",
            "label": <Box direction='row' justify='between'><span>Asia/Seoul</span><span className='secondary'>UTC +9:00</span></Box>
          },{
            value: "Asia/Tokyo (UTC +9:00)",
            sub: "+0900",
            "label": <Box direction='row' justify='between'><span>Asia/Tokyo</span><span className='secondary'>UTC +9:00</span></Box>
          },{
            value: "Asia/Ulaanbataar (UTC +9:00)",
            sub: "+0900",
            "label": <Box direction='row' justify='between'><span>Asia/Ulaanbataar</span><span className='secondary'>UTC +9:00</span></Box>
          },{
            value: "Asia/Yakutsk (UTC +9:00)",
            sub: "+0900",
            "label": <Box direction='row' justify='between'><span>Asia/Yakutsk</span><span className='secondary'>UTC +9:00</span></Box>
          },{
            value: "Australia/Darwin (UTC +9:30)",
            sub: "+0930",
            "label": <Box direction='row' justify='between'><span>Australia/Darwin</span><span className='secondary'>UTC +9:30</span></Box>
          },{
            value: "Australia/Adelaide (UTC +9:30)",
            sub: "+0900",
            "label": <Box direction='row' justify='between'><span>Australia/Adelaide</span><span className='secondary'>UTC +9:30</span></Box>
          },{
            value: "Asia/Vladivostok (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Asia/Vladivostok</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Australia/Sydney (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Australia/Sydney</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Australia/Brisbane (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Australia/Brisbane</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Australia/Melbourne (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Australia/Melbourne</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Australia/Hobart (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Australia/Hobart</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Pacific/Port Moresby (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Pacific/Port Moresby</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Pacific/Guam (UTC +10:00)",
            sub: "+1000",
            "label": <Box direction='row' justify='between'><span>Pacific/Guam</span><span className='secondary'>UTC +10:00</span></Box>
          },{
            value: "Pacific/Noumea (UTC +11:00)",
            sub: "+1100",
            "label": <Box direction='row' justify='between'><span>Pacific/Noumea</span><span className='secondary'>UTC +11:00</span></Box>
          },{
            value: "Asia/Magadan (UTC +11:00)",
            sub: "+1100",
            "label": <Box direction='row' justify='between'><span>Asia/Magadan</span><span className='secondary'>UTC +11:00</span></Box>
          },{
            value: "Pacific/Fiji (UTC +12:00)",
            sub: "+1200",
            "label": <Box direction='row' justify='between'><span>Pacific/Fiji</span><span className='secondary'>UTC +12:00</span></Box>
          },{
            value: "Pacific/Majuro (UTC +12:00)",
            sub: "+1200",
            "label": <Box direction='row' justify='between'><span>Pacific/Majuro</span><span className='secondary'>UTC +12:00</span></Box>
          },{
            value: "Pacific/Auckland (UTC +12:00)",
            sub: "+1200",
            "label": <Box direction='row' justify='between'><span>Pacific/Auckland</span><span className='secondary'>UTC +12:00</span></Box>
          },{
            value: "Pacific/Kamchatka (UTC +12:00)",
            sub: "+1200",
            "label": <Box direction='row' justify='between'><span>Pacific/Kamchatka</span><span className='secondary'>UTC +12:00</span></Box>
          },{
            value: "Pacific/Tongatapu (UTC +13:00)",
            sub: "+1300",
            "label": <Box direction='row' justify='between'><span>Pacific/Tongatapu</span><span className='secondary'>UTC +13:00</span></Box>
          }]}
          value={this.state.timezoneLabel}
          onChange={(target) => {
            this.setState({timezone: target.option.value});
            this.setState({timezoneLabel: target.option.value})
          }}
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
