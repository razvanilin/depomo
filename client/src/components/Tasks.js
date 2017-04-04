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

import Responsive from 'grommet/utils/Responsive'

import getTasks from '../actions/getTasks'

export default Component({
  componentWillMount() {
    this.state = {
      listItemDirection: "row",
      labelWidth: "20%"
    }

    if (this.props.user) {
      getTasks(this.props.user._id, (success, message) => {
        if (!success) console.log(message);
      });
    }
  },

  componentDidMount() {
    this._responsive = Responsive.start(this._onResponsive);
  },

  componentWillUnmout() {
    this._responsive.stop();
  },

  _onResponsive(small) {
    if (small && this.state.listItemDirection !== "column") {
      this.setState({listItemDirection: "column"});
      this.setState({labelWidth: "90%"});
    } else if (!small && this.state.listItemDirection !== "row") {
      this.setState({listItemDirection: "row"});
      this.setState({labelWidth: "20%"});
    }
  },

  _renderTasks() {
    if (this.props.task && this.props.task.tasks && this.props.task.tasks.length > 0) {
      return (
        <Box margin={{vertical:"medium"}}>
          <Label style={{paddingLeft:"20px"}}>Current tasks</Label>

          <List selectable={true}>
            {
              this.props.task.tasks.map((task) => {
                //let task = this.props.task.tasks[index];
                if (task.status === 'waiting') {
                  return (
                    <ListItem direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                        <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                          <Label truncate={true}>{task.label}</Label>
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} primary={false} icon={<Money/>} label={task.deposit + " " + task.currency} />
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} icon={<Clock/>} label={task.due}/>
                        </Box>
                        <Box justify="end" align="end">
                          <Menu inline={true} direction="row">
                            <Anchor animateIcon={true} icon={<Checkmark colorIndex="ok"/>} />
                            <Anchor animateIcon={true} icon={<Trash colorIndex="critical"/>} />
                          </Menu>
                        </Box>
                    </ListItem>
                  )
                } else {
                  return(<span key={task._id}></span>)
                }
              })
            }
          </List>
        </Box>
      )
    }
  },

  _renderPast() {
    if (this.props.task && this.props.task.tasks && this.props.task.tasks.length > 0) {
      return (
        <Box>
          <Label style={{paddingLeft:"20px"}}>Past tasks</Label>

          <List selectable={true}>
            {
              this.props.task.tasks.map((task) => {
                //let task = this.props.task.tasks[index];
                if (task.status !== 'waiting' && task.status !== 'initial') {
                  return (
                    <ListItem colorIndex="light-2" direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                        <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                          <Label truncate={true}>{task.label}</Label>
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} primary={false} icon={<Money/>} label={task.deposit + " " + task.currency} />
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} icon={<Clock/>} label={task.due}/>
                        </Box>
                        <Box justify="end" align="end">
                          {task.status === 'paid' && <Label>💗</Label>}
                          {task.status === 'completed' && <Label>✌️</Label>}
                        </Box>
                    </ListItem>
                  )
                } else {
                  return(<span key={task._id}></span>)
                }
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
        {this._renderPast()}

        {this.props.children}
      </Section>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))
