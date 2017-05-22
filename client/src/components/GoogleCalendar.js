import React from 'react'
import { Component, Goto } from 'jumpsuit'

import Layer from 'grommet/components/Layer'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Paragraph from 'grommet/components/Paragraph'
import Button from 'grommet/components/Button'
import Spinning from 'grommet/components/icons/Spinning'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import Label from 'grommet/components/Label'
import Checkmark from 'grommet/components/icons/base/Checkmark'

import connectGoogleCalendar from '../actions/connectGoogleCalendar'
import getGoogleCalendarList from '../actions/getGoogleCalendarList'
import selectCalendar from '../actions/selectCalendar'

export default Component({
  componentWillMount() {

    this.state = {
      list: false,
      listLoading: true,
      listError: false,
      selectedCalendar: ""
    }

    if (this.props.user.paymentMethods.length < 1) {
      Goto({
        path: "/dashboard/tasks/add/payment"
      });
    }

    getGoogleCalendarList(this.props.user, (err, response) => {
      if (err) return this.setState({listLoading: false, listError: err});

      this.setState({listLoading: false});

      response && this.setState({list: response.items});
    })
  },

  _connectGoogleCalendar() {
    connectGoogleCalendar(this.props.user, (err, response) => {
      if (err) console.log(err);
    });
  },

  _selectCalendar() {
    this.setState({listLoading: true})
    selectCalendar(this.props.user, this.state.selectedCalendar, (err, repsonse) => {
      if (err) return this.setState({listError: err, listLoading: false});

      this.setState({listSuccess: true, listLoading: false});
    })
  },

  render() {
    return(
      <Layer closer={true} onClose={() => {Goto({path:"/dashboard/tasks"})}}>
        <Box justify="center" align="center" pad="small" direction="column">
          <Heading tag="h3">Google Calendar Integration</Heading>
          {this.state.listLoading && <Spinning />}
          {!this.state.list &&
            <Box direction="column" justify="center" align="center">
              <Heading tag="h4">{"What's this for?"}</Heading>
              <Paragraph>By connecting to your Google Calendar you will be able to create tasks in Depomo straight from there!</Paragraph>
              <Paragraph>All you need to do when creating an event in Google Calendar is to include <strong>Depomo X</strong> in the title, where <strong>X</strong> is the deposit you would like to place.</Paragraph>

              <Button primary={true} label="Connect" onClick={this._connectGoogleCalendar} />
            </Box>
          }

          {this.state.list && !this.state.listSuccess &&
            <Box direction="column" justify="center" align="center">
              <Heading tag="h4">Select which calendar you would like to use to record tasks</Heading>

              <List selectable={true}>
                {this.state.list.map(calendar => {
                  return (
                    <ListItem key={calendar.id}
                              primary={this.state.selectedCalendar === calendar.id}
                              onClick={() => {console.log(calendar.id);this.setState({selectedCalendar: calendar.id})}}>
                      <Label>{calendar.summary}</Label>
                    </ListItem>
                  )
                })}
              </List>

              {this.state.selectedCalendar && <Button style={{marginTop:"20px"}} primary={true} label="Connect to calendar" onClick={this._selectCalendar}/> }
            </Box>
          }

          {this.state.listSuccess &&
            <Box direction="column" justify="center" align="center">
              <Heading><Checkmark colorIndex="ok" /></Heading>
              <Heading tag="h3">Your calendar was successfully connected to Depomo 👍</Heading>

              <Button label="Close" path="/dashboard/tasks" />
            </Box>
          }
        </Box>
      </Layer>
    )
  }
}, state => ({
  user: state.user
}))
