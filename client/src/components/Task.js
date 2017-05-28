const moment = require('moment-timezone');
import React from 'react'
import { Component, Goto } from 'jumpsuit'

import Layer from 'grommet/components/Layer'
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'
import Button from 'grommet/components/Button'
import Checkmark from 'grommet/components/icons/base/Checkmark'
import Trash from 'grommet/components/icons/base/Trash'
import Label from 'grommet/components/Label'
import Value from 'grommet/components/Value'
import Toast from 'grommet/components/Toast'

import getTasks from '../actions/getTasks'
import {completeTask} from '../actions/completeTask'
import removeTask from '../actions/removeTask'

export default Component({
  componentWillMount() {
    this.state = {loading: true};

    if (this.props.task && this.props.task.tasks) {
      this._getTaskDetais();
    } else {
      getTasks(this.props.user, (success, message) => {
        if (!success) return this.setState({error: message, loading: false});

        this.setState({loading: false});
        this._getTaskDetais();
      });
    }
  },

  _getTaskDetais() {
    // get the selected task
    let taskId = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

    for (var i=0; i<this.props.task.tasks.length; i++) {
      if (this.props.task.tasks[i]._id === taskId) {
        this.setState({task: this.props.task.tasks[i]});
      }
    }
  },

  _onTaskCompleted() {
    // refresh the selected task
    this.setState({complete: ""});
    completeTask(this.state.task._id, 0, this.props.user._id, (success, data) => {
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

  _onTaskRemoved() {
    removeTask(this.state.task._id, this.props.user._id, (success, data) => {
      if (!success) {
        this.setState({removeError: data});
      } else {
        this.setState({removeSuccess: true});

        // if everything is fine, load the tasks again
        getTasks(this.props.user, (success, message) => {
          if (!success) console.log(message);
        });
      }
    });
  },

  render() {
    return(
      <Layer closer={true} size="large"
        onClose={() => {
          Goto({
            path:window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'))
          })
        }}>
        <Box direction="column" pad="medium" justify="center" align="center">
          <Heading tag="h3" align="center">{this.state.task.label}</Heading>

          <Label>Deposit amount: <strong>{this.state.task.deposit + " " + this.state.task.currency}</strong></Label>
          <Label>Task due: <strong>{this.state.task.due}</strong></Label>

          <Box direction="row" justify="center" align="center">
            <Box pad="medium">
              { !this.state.completeSuccess && !this.state.removeSuccess &&
                <Button label="Complete task" icon={<Checkmark />} onClick={()=>{ this._onTaskCompleted()}}/>
              }
              { this.state.completeSuccess &&
                <Value value={""} icon={<Checkmark />} colorIndex="ok" label="Task completed" />
              }
            </Box>
              {/* Check if more than 5 minutes passed from creation*/
                moment.tz().utc().diff(moment(this.state.task.createdAt), 'minutes') < 5 && !this.state.removeSuccess && !this.state.completeSuccess &&
                <Box pad="medium">
                  <Button secondary={true} label="Delete task" icon={<Trash />} onClick={() => {this._onTaskRemoved()}} />
                </Box>
              }
              { this.state.removeSuccess &&
                <Value value={""} icon={<Checkmark />} colorIndex="ok" label="Task deleted" />
              }
          </Box>
        </Box>

        {this.state.completeError &&
          <Toast status='critical' onClose={ () => { this.setState({completeError: false}) }}>
            Oh no 🙀 There was an error with completing the task. Please try again 🙏
          </Toast>
        }

        {this.state.completeSuccess &&
          <Toast status='ok'
            onClose={ () => {
              this.setState({completeSuccess: false});
              Goto({
                path: window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
              });
            }}>
            Way to go! 😻 One more step towards conquering that procrastination 👊
          </Toast>
        }

        {this.state.removeError &&
          <Toast status='critical' onClose={ () => { this.setState({removeError: false}) }}>
            Oh no 🙀 {this.state.removeError}
          </Toast>
        }

        {this.state.removeSuccess &&
          <Toast status='ok' onClose={ () => {
            this.setState({removeSuccess: false});
            Goto({
              path: window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
            });
          }}>
            The task was removed successfully 👌
          </Toast>
        }
      </Layer>
    )
  }
}, state => ({
  user: state.user,
  task: state.task
}))
