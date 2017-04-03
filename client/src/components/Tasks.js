import React from 'react'
import { Component, Link } from 'jumpsuit';

import Section from 'grommet/components/Section'
import Header from 'grommet/components/Header'
import Button from 'grommet/components/Button'
import Label from 'grommet/components/Label'
import Box from 'grommet/components/Box'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import Menu from 'grommet/components/Menu'
import Anchor from 'grommet/components/Anchor'

import AddIcon from 'grommet/components/icons/base/Add'
import Checkmark from 'grommet/components/icons/base/Checkmark'
import Trash from 'grommet/components/icons/base/Trash'
import Money from 'grommet/components/icons/base/Money'
import Clock from 'grommet/components/icons/base/Clock'

import getTasks from '../actions/getTasks'

export default Component({
  componentWillMount() {
    if (this.props.user) {
      getTasks(this.props.user._id, (success, message) => {
        if (!success) console.log(message);
      });
    }
  },

  _renderTasks() {
    if (this.props.task && this.props.task.tasks && this.props.task.tasks.length > 0) {
      return (
        <Box>
          <Label style={{paddingLeft:"20px"}}>Current tasks</Label>

          <List selectable={true}>
            {
              this.props.task.tasks.map((task) => {
                //let task = this.props.task.tasks[index];
                console.log(task);
                return (
                  <ListItem key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                    <Label size="small">{task.label}</Label>
                    <Anchor icon={<Money/>} label={task.deposit + " " + task.currency} />
                    <Anchor icon={<Clock/>} label={task.due}/>
                    <span>
                      <Menu inline={true} direction="row">
                        <Anchor animateIcon={true} icon={<Checkmark colorIndex="ok"/>} />
                        <Anchor animateIcon={true} icon={<Trash colorIndex="critical"/>} />
                      </Menu>
                    </span>
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
      )
    }
  },

  render() {
    return(
      <Section>
        <Header justify="center">
          <Link to='/dashboard/tasks/add'><Button label="Add a new task" icon={<AddIcon />} size="large" primary={true}
            onClick={ () => { console.log("add"); }}
          /></Link>
        </Header>

        {this._renderTasks()}

        {this.props.children}
      </Section>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))
