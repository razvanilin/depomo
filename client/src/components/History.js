import React from 'react'
import { Component } from 'jumpsuit'

import Section from 'grommet/components/Section'
import Label from 'grommet/components/Label'
import Box from 'grommet/components/Box'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import Anchor from 'grommet/components/Anchor'
import Alert from 'grommet/components/icons/base/Alert'
import Responsive from 'grommet/utils/Responsive'
import Favorite from 'grommet/components/icons/base/Favorite'
import Money from 'grommet/components/icons/base/Money'
import Clock from 'grommet/components/icons/base/Clock'
import Heading from 'grommet/components/Heading'
import Tabs from 'grommet/components/Tabs'
import Tab from 'grommet/components/Tab'
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'

import getTasks from '../actions/getTasks'

export default Component({
  componentWillMount() {
    this.state = {
      listItemDirection: "row",
      labelWidth: "20%"
    }

    getTasks(this.props.user, (success, message) => {
      if (!success) this.setState({tasksError: true});

      this.setState({tasksLoaded: true});
    });
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

  _renderAll() {
    return (
      <List selectable={true}>
        { this.state.tasksLoaded &&
          this.props.task.tasks.map((task) => {
            //let task = this.props.task.tasks[index];
            if (task.status === 'completed' || task.status === 'failed') {
              return (
                <ListItem colorIndex={task.status === 'completed' ? 'accent-2' : 'grey-3-a'} direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                    <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                      <Label truncate={true}>{task.label}</Label>
                    </Box>
                    <Box justify="start" align="start">
                      <Anchor style={{fontSize:"90%"}} primary={false} title={task.status === 'completed' ? "You got the deposit back" : "The deposit was lost"} icon={<Money/>} label={(task.deposit) + " " + task.currency} />
                    </Box>
                    <Box>
                      <Anchor style={{fontSize:"90%"}} primary={false} title="Donation" icon={<Favorite title="Donation"/>} label={(task.refund === -1 ? task.deposit : task.donation) + " " + task.currency} />
                    </Box>
                    <Box justify="start" align="start">
                      <Anchor style={{fontSize:"90%"}} icon={<Clock/>} label={task.due}/>
                    </Box>
                    <Box style={{flexDirection: "row"}} direction="row" justify="center" align="center">
                      {(task.transactionStatus === 'authorization_expired' ||
                        task.transactionStatus === 'processor_declined' ||
                        task.transactionStatus === 'gateway_rejected' ||
                        task.transactionStatus === 'failed' ||
                        task.transactionStatus === 'settlement_declined' ||
                        task.transactionStatus === 'payment_failed') &&
                          <Anchor animateIcon={true} title="The deposit failed to be processed. Click to retry."
                                  icon={<Alert colorIndex="warning"/>}
                                  onClick={() => { this._onCompletePayment(task._id) }} />}

                      {(task.refund < task.deposit || task.donation > 0) && <Label title="Helped us with a donation <3">💗</Label>}
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
    )
  },

  _renderFiltered(filter) {
    return (
      <List selectable={true}>
        { this.state.tasksLoaded &&
          this.props.task.tasks.map((task) => {
            //let task = this.props.task.tasks[index];
            if (task.status === filter) {
              return (
                <ListItem colorIndex={task.status === 'completed' ? 'accent-2' : 'grey-3-a'} direction={this.state.listItemDirection} key={task._id} responsive={false} primary={true} justify="between" separator="horizontal">
                    <Box style={{width:this.state.labelWidth}} justify="center" align="start">
                      <Label truncate={true}>{task.label}</Label>
                    </Box>
                    <Box justify="start" align="start">
                      <Anchor style={{fontSize:"90%"}} primary={false} title={task.status === 'completed' ? "You got the deposit back" : "The deposit was lost"} icon={<Money/>} label={(task.deposit) + " " + task.currency} />
                    </Box>
                    <Box>
                      <Anchor style={{fontSize:"90%"}} primary={false} title="Donation" icon={<Favorite title="Donation"/>} label={(task.refund === -1 ? task.deposit : task.donation) + " " + task.currency} />
                    </Box>
                    <Box justify="start" align="start">
                      <Anchor style={{fontSize:"90%"}} icon={<Clock/>} label={task.due}/>
                    </Box>
                    <Box style={{flexDirection: "row"}} direction="row" justify="center" align="center">
                      {(task.transactionStatus === 'authorization_expired' ||
                        task.transactionStatus === 'processor_declined' ||
                        task.transactionStatus === 'gateway_rejected' ||
                        task.transactionStatus === 'failed' ||
                        task.transactionStatus === 'settlement_declined' ||
                        task.transactionStatus === 'payment_failed') &&
                          <Anchor animateIcon={true} title="The deposit failed to be processed. Click to retry."
                                  icon={<Alert colorIndex="warning"/>}
                                  onClick={() => { this._onCompletePayment(task._id) }} />}

                      {(task.refund < task.deposit || task.donation > 0) && <Label title="Helped us with a donation <3">💗</Label>}
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
    )
  },

  _prepareChart() {
    var completed = 0;
    var failed = 0;
    for (var i=0; i<this.props.task.tasks.length; i++) {
      if (this.props.task.tasks[i].status === 'completed'){
        completed++;
      } else if (this.props.task.tasks[i].status !== 'initial') {
        failed++;
      }
    }

    return [{
      label: "Completed",
      value: completed,
      colorIndex: "brand"
    }, {
      label: "Failed",
      value: failed,
      colorIndex: "accent-1"
    }]
  },

  render() {
    return (
      <Section>
        <Box>
          <Box pad={{horizontal: "medium"}} justify="between" align="center" direction="row">
            <Heading tag="h3" align="center">History</Heading>

            <AnnotatedMeter max={this.props.task.tasks.length} legend={false} type="bar"
              series={this._prepareChart()} />
          </Box>
          <Tabs>
            <Tab title="All Tasks">
              {this._renderAll()}
            </Tab>
            <Tab title="Completed Tasks">
              {this._renderFiltered('completed')}
            </Tab>
            <Tab title="Failed Tasks">
              {this._renderFiltered('failed')}
            </Tab>
          </Tabs>
        </Box>
      </Section>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))