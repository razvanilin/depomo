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
import Value from 'grommet/components/Value'

import AddIcon from 'grommet/components/icons/base/Add'
import Checkmark from 'grommet/components/icons/base/Checkmark'
import Trash from 'grommet/components/icons/base/Trash'
import Money from 'grommet/components/icons/base/Money'
import Clock from 'grommet/components/icons/base/Clock'

export default Component({
  render() {
    return(
      <Section>
        <Header justify="center">
          <Link to='/dashboard/tasks/add'><Button label="Add a new task" icon={<AddIcon />} size="large" primary={true}
            onClick={ () => { console.log("add"); }}
          /></Link>
        </Header>

        <Box>
          <Label style={{paddingLeft:"20px"}}>Current tasks</Label>

          <List selectable={true}>
            <ListItem responsive={false} primary={true} justify="between" separator="horizontal">
              <span>Go to the doctor</span>
              <Value size="xsmall" value={5} icon={<Money/>} units="USD" />
              <Value size="xsmall" value={"4/2/2017 2:12 pm"} icon={<Clock/>} />
              <span>
                <Menu inline={true} direction="row">
                  <Anchor animateIcon={true} icon={<Checkmark colorIndex="ok"/>} />
                  <Anchor animateIcon={true} icon={<Trash colorIndex="critical"/>} />
                </Menu>
              </span>
            </ListItem>
          </List>
        </Box>

        <Box margin={{vertical:"medium"}}>
          <Label style={{paddingLeft:"20px"}}>Past tasks</Label>

          <List selectable={true}>
            <ListItem responsive={false} primary={true} justify="between" separator="horizontal">
              <span>Go to the doctor</span>
              <Value size="xsmall" value={5} icon={<Money/>} units="USD" />
              <Value size="xsmall" value={"4/2/2017 2:12 pm"} icon={<Clock/>} />
            </ListItem>
          </List>
        </Box>

        {this.props.children}
      </Section>
    )
  }
}, state => ({
  user: state.user
}))
