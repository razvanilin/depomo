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
import Toast from 'grommet/components/Toast'
import Layer from 'grommet/components/Layer'
import Heading from 'grommet/components/Heading'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'

import AddIcon from 'grommet/components/icons/base/Add'
import Checkmark from 'grommet/components/icons/base/Checkmark'
import Trash from 'grommet/components/icons/base/Trash'
import Money from 'grommet/components/icons/base/Money'
import Clock from 'grommet/components/icons/base/Clock'
import Favorite from 'grommet/components/icons/base/Favorite'
import Alert from 'grommet/components/icons/base/Alert'

import Responsive from 'grommet/utils/Responsive'

import getTasks from '../actions/getTasks'
import completeTask from '../actions/completeTask'
import removeTask from '../actions/removeTask'
import completePayment from '../actions/completePayment'

export default Component({
  componentWillMount() {
    this.state = {
      listItemDirection: "row",
      labelWidth: "20%",
      tasksLoaded: false,
      donation: 0
    }

    if (this.props.user) {
      getTasks(this.props.user, (success, message) => {
        if (!success) console.log(message);
        this.setState({tasksLoaded: true});
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

  _onTaskCompleted(taskId) {
    completeTask(taskId, this.state.donation, this.props.user._id, (success, data) => {
      if (!success) {
        this.setState({completeError: true});
      } else {
        this.setState({completeSuccess: true});

        // if everything is fine, load the tasks again
        getTasks(this.props.user, (success, message) => {
          if (!success) console.log(message);
        });
      }

      this.setState({complete: ""});
    });
  },

  _onRenderComplete(task) {
    return (
      <Layer closer={true} onClose={() => { this.setState({complete: ""}) }}>
        <Box direction="column" pad="medium" justify="center" align="center">
          <Heading tag="h2"> Have you finished the task? 🤔</Heading>
          <Box direction="column" pad="medium" justify="center" align="center">
            <FormField label="Would you like to make a donation from your deposit?">
              <NumberInput max={this.state.complete.deposit} min={0} value={this.state.donation} onChange={event => {this.setState({donation: event.target.value});}} />
            </FormField>
          </Box>
          <Box direction="row" pad="medium" justify="center" align="center">
            <Box pad="small"><Button primary={true} label="Yes, I completed it" onClick={() => {this._onTaskCompleted(this.state.complete._id)}} /></Box>
            <Box pad="small"><Button secondary={true} label="No, I changed my mind" onClick={() => {this.setState({complete: ""}) }} /></Box>
          </Box>
        </Box>
      </Layer>
    )
  },

  _onRemoveTriggered(taskId) {
    this.setState({deleteSelected: taskId});
  },

  _onTaskRemoved() {
    removeTask(this.state.deleteSelected, this.props.user._id, (success, data) => {
      if (!success) {
        this.setState({removeError: true});
      } else {
        this.setState({removeSuccess: true});

        // if everything is fine, load the tasks again
        getTasks(this.props.user, (success, message) => {
          if (!success) console.log(message);
        });
      }

      this.setState({deleteSelected: ""});
    });
  },

  _onCompletePayment(taskId) {
    completePayment(taskId, this.props.user._id, (success, data) => {
      console.log(success);
      console.log(data);
    });
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
                if (task.status !== 'completed' && task.status !== 'failed') {
                  return (
                    <ListItem direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                        <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                          <Label truncate={true}>{task.label}</Label>
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} title="Deposit" primary={false} icon={<Money/>} label={task.deposit + " " + task.currency} />
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} title="Due date" icon={<Clock/>} label={task.due}/>
                        </Box>
                        <Box justify="end" align="end">
                          <Menu inline={true} direction="row">
                            <Anchor animateIcon={true} icon={<Checkmark colorIndex="ok"/>} onClick={() => { this.setState({complete: task}); }} />
                            <Anchor animateIcon={true} icon={<Trash colorIndex="critical"/>} onClick={() => {this._onRemoveTriggered(task._id)}} />
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
                if (task.status === 'completed' || task.status === 'failed') {
                  return (
                    <ListItem colorIndex="light-2" direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                        <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                          <Label truncate={true}>{task.label}</Label>
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} primary={false} title="Refund" icon={<Money/>} label={(task.refund === -1 ? 0 : task.refund) + " " + task.currency} />
                        </Box>
                        <Box>
                          <Anchor style={{fontSize:"90%"}} primary={false} title="Donation" icon={<Favorite title="Donation"/>} label={(task.refund === -1 ? task.deposit : task.deposit - task.refund) + " " + task.currency} />
                        </Box>
                        <Box justify="start" align="start">
                          <Anchor style={{fontSize:"90%"}} icon={<Clock/>} label={task.due}/>
                        </Box>
                        <Box style={{flexDirection: "row"}} direction="row" justify="center" align="center">
                          {(task.transactionStatus === 'authorization_expired' ||
                            task.transactionStatus === 'processor_declined' ||
                            task.transactionStatus === 'gateway_rejected' ||
                            task.transactionStatus === 'failed' ||
                            task.transactionStatus === 'settlement_declined') &&
                              <Anchor animateIcon={true} title="The deposit failed to be processed. Click to retry."
                                      icon={<Alert colorIndex="warning"/>}
                                      onClick={() => { this._onCompletePayment(task._id) }} />}

                          {task.refund < task.deposit && <Label title="Helped us with a donation <3">💗</Label>}
                          {task.status === 'completed' && <Label title="Task completed">😎</Label>}
                          {task.status === 'failed' && <Label title="Task not completed in time.">😯</Label>}
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

        {this.state.completeError &&
          <Toast status='critical' onClose={ () => { this.setState({completeError: false}) }}>
            Oh no 🙀 There was an error with completing the task. Please try again 🙏
          </Toast>
        }

        {this.state.completeSuccess &&
          <Toast status='ok' onClose={ () => { this.setState({completeSuccess: false}) }}>
            Way to go! 😻 One more step towards conquering that procrastination 👊
          </Toast>
        }

        {this.state.removeError &&
          <Toast status='critical' onClose={ () => { this.setState({removeError: false}) }}>
            Oh no 🙀 There was an error with removing the task. Please try again 🙏
          </Toast>
        }

        {this.state.removeSuccess &&
          <Toast status='ok' onClose={ () => { this.setState({removeSuccess: false}) }}>
            The task was removed successfully 👌
          </Toast>
        }

        {this.state.deleteSelected &&
          <Layer closer={true} onClose={() => { this.setState({deleteSelected: ""}) }}>
            <Box direction="column" pad="medium" justify="center" align="center">
              <Heading>Are you sure you want to remove the task? 🤔</Heading>
              <Box direction="row" pad="medium" justify="center" align="center">
                <Box pad="small"><Button primary={true} label="Yes, remove it" onClick={this._onTaskRemoved} /></Box>
                <Box pad="small"><Button secondary={true} label="No, I still want it" onClick={() => {this.setState({deleteSelected: ""}) }} /></Box>
              </Box>
            </Box>
          </Layer>
        }

        {this.state.complete && this._onRenderComplete()}

        {this.state.tasksLoaded && this._renderTasks()}
        {this.state.tasksLoaded && this._renderPast()}

        {this.props.children}
      </Section>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))
