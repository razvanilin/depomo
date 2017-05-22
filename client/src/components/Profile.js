import React from 'react'
import { Component } from 'jumpsuit'

import Section from 'grommet/components/Section'
import Box from 'grommet/components/Box'
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
import Label from 'grommet/components/Label'
import MoneyIcon from 'grommet/components/icons/base/Money'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
import Heading from 'grommet/components/Heading'

import Responsive from 'grommet/utils/Responsive'

import getTasks from '../actions/getTasks'

export default Component({
  componentWillMount() {
    this.state = {

    }

    if (this.props.user) {
      getTasks(this.props.user, (success, message) => {
        if (!success) console.log(message);

        var depositEur = 0, depositUsd = 0, depositGbp = 0;
        var savedEur = 0, savedGbp = 0, savedUsd = 0;
        var totalEur = 0, totalGbp = 0, totalUsd = 0;
        this.props.task.tasks.map(task => {
          if (task.status === 'completed') {
            switch (task.currency) {
              case 'USD':
                savedUsd += task.deposit;
                break;
              case 'EUR':
                savedEur += task.deposit;
                break;
              case 'GBP':
                savedGbp += task.deposit;
                break;
              default:
                break;
            }
          } else if (task.status !== 'initial' && task.status !== 'deleted') {
            switch (task.currency) {
              case 'USD':
                depositUsd += task.deposit;
                break;
              case 'EUR':
                depositEur += task.deposit;
                break;
              case 'GBP':
                depositGbp += task.deposit;
                break;
              default:
                break;
            }
          } else if (task.status === 'initial') {
            switch (task.currency) {
              case 'USD':
                totalUsd += task.deposit;
                break;
              case 'EUR':
                totalEur += task.deposit;
                break;
              case 'GBP':
                totalGbp += task.deposit;
                break;
              default:
                break;
            }
          }
          return [];
        });

        totalEur = totalEur + savedEur + depositEur;
        totalGbp = totalGbp + savedGbp + depositGbp;
        totalUsd = totalUsd + savedUsd + savedGbp;

        this.setState({
          tasksLoaded: true,
          depositGbp: depositGbp,
          depositEur: depositEur,
          depositUsd: depositUsd,
          savedGbp: savedGbp,
          savedEur: savedEur,
          savedUsd: savedUsd,
          totalEur: totalEur,
          totalGbp: totalGbp,
          totalUsd: totalUsd
        });

        if (totalEur === 0) this.setState({hideEur: true});
        if (totalGbp === 0) this.setState({hideGbp: true});
        if (totalUsd === 0) this.setState({hideUsd: true});
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
    if (small && !this.state.mobile) {
      this.setState({mobile: true});
    } else if (!small && this.state.mobile) {
      this.setState({mobile: false});
    }
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
      label: "Completed tasks",
      value: completed,
      colorIndex: "brand"
    }, {
      label: "Failed tasks",
      value: failed,
      colorIndex: "accent-1"
    }]
  },

  _getCompletionRate() {
    var completed = 0;
    var failed = 0;
    for (var i=0; i<this.props.task.tasks.length; i++) {
      if (this.props.task.tasks[i].status === 'completed'){
        completed++;
      } else if (this.props.task.tasks[i].status !== 'initial') {
        failed++;
      }
    }

    try {
      return parseInt((completed * 100) / (completed+failed),10);
    } catch (e) {
      return (completed * 100) / (completed+failed);
    }
  },

  render() {
    return (
      <Section>
      {this.state.tasksLoaded &&
        <Box direction="row" pad={{horizontal: "medium"}} align="center">
          <Box direction="column" justify="between" align="center" separator="right" pad="medium" basis="1/2">
            <Heading tag="h3" align="center"><strong>Hi {this.props.user.name},</strong><br /> These are your current stats</Heading>

            <Box direction="row" justify="between" align="start">
              <Box margin={{horizontal:"medium"}} direction="column">
                <AnnotatedMeter legend={true} type="circle"
                  series={this._prepareChart()} />
              </Box>

              <Box margin={{horizontal:"medium"}} direction="column">
                <Meter type="arc" value={this._getCompletionRate()} onActive={() => {}}
                  colorIndex={this._getCompletionRate() < 25 ? 'critical' :
                    this._getCompletionRate() >= 25 && this._getCompletionRate() < 50 ? 'warning' : 'ok'}/>
                <Value value={this._getCompletionRate()} units="%" label="Your completion rate" />
              </Box>
            </Box>

            <Box direction="column" justify="center" align="center">
              {(!this.props.task.tasks || this.props.task.tasks.length < 3) &&
                <Label>Start recording more tasks to make yourself a productive super hero 🏃</Label>
              }
              {this.props.task.tasks && this.props.task.tasks.length > 3 &&
                <Label>Great progress so far, we are impressed😺</Label>
              }
              {this._getCompletionRate() < 50 &&
                <Label style={{marginTop: "0px"}}>{"Let's try and lift the completion rate a little now 💪"}</Label>
              }
            </Box>
            <Button primary={false} path="/dashboard/tasks/add" label="Add a new task" icon={<AddIcon />} />
          </Box>

          <Box direction="column" justify="center" align="center" basis="1/2">
            <Label>Total deposits placed</Label>
            <Box direction="row" flex="grow" justify="between" align="center" separator="bottom">
              <Box className={this.state.hideUsd ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.totalUsd} units="$" icon={<MoneyIcon />} label="USD" />
              </Box>
              <Box className={this.state.hideEur ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.totalEur} units="€" icon={<MoneyIcon />} label="EUR" />
              </Box>
              <Box className={this.state.hideGbp ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.totalGbp} units="£" icon={<MoneyIcon />} label="GBP" />
              </Box>
            </Box>

            <Label>Total deposits saved</Label>
            <Box direction="row" flex="grow" justify="between" align="center">
              <Box className={this.state.hideUsd ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.savedUsd} units="$" icon={<MoneyIcon />} label="USD" colorIndex="ok"/>
              </Box>
              <Box className={this.state.hideEur ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.savedEur} units="€" icon={<MoneyIcon />} label="EUR" colorIndex="ok"/>
              </Box>
              <Box className={this.state.hideGbp ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.savedGbp} units="£" icon={<MoneyIcon />} label="GBP" colorIndex="ok"/>
              </Box>
            </Box>

            <Label>Total contributions</Label>
            <Box direction="row" flex="grow" justify="between" align="center">
              <Box className={this.state.hideUsd ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.depositUsd} units="$" icon={<MoneyIcon />} label="USD" colorIndex="warning"/>
              </Box>
              <Box className={this.state.hideEur ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.depositEur} units="€" icon={<MoneyIcon />} label="EUR" colorIndex="warning"/>
              </Box>
              <Box className={this.state.hideGbp ? 'hidden' : ''} pad={{horizontal:"medium"}} margin={{bottom:"medium"}} justify="center" align="center">
                <Value value={this.state.depositGbp} units="£" icon={<MoneyIcon />} label="GBP" colorIndex="warning"/>
              </Box>
            </Box>
          </Box>
        </Box>
      }
      </Section>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))
