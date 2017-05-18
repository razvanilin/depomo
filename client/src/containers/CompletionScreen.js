import React from 'react'
import { Component } from 'jumpsuit'

import HappyImage from '../images/depomo_logo4.png'
import SadImage from '../images/depomo_logo4_sad.png'

import Heading from 'grommet/components/Heading'
import Image from 'grommet/components/Image'
import Box from 'grommet/components/Box'
import HomeIcon from 'grommet/components/icons/base/Home'
import Anchor from 'grommet/components/Anchor'
import Card from 'grommet/components/Card'

import Spinning from 'grommet/components/icons/Spinning'

import { completeTaskWithToken } from '../actions/completeTask'

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export default Component({

  componentWillMount() {
    this.state = {loading: true};

    // get the query string
    var taskId = getQueryStringValue('taskId');
    var token = getQueryStringValue('token');

    if (!taskId || !token) {
      return this.setState({error: true});
    }
    completeTaskWithToken(taskId, token, (err, task) => {
      if (err) return this.setState({error: err});

      this.setState({task: task});
    });
  },

  render() {
    return (
      <Box pad="large" justify="center" align="center" direction="column">
        {!this.state.error && !this.state.task && <Heading tag="h2" align="center">Sending the robots to complete the task <Spinning size="large"/></Heading>}

        {this.state.task && <Image size="small" src={HappyImage}/> }
        {this.state.error && <Image size="small" src={SadImage}/> }

        {this.state.task && <Heading tag="h3" align="center">Yay! You completed the task 👍</Heading> }
        {this.state.error && <Heading tag="h3" margin="large" align="center">Oh no! 🙀 There was an error with your request. <br/>Please try again or log in to Depomo and complete the task manually.</Heading>}

        {this.state.task && <Card align="center" pad="medium" margin={{bottom: "medium"}} label={this.state.task.label}
              heading={this.state.task.deposit + " " + this.state.task.currency}
              description='Your deposit is safe and sound in your account. Good job on breaking procrastination. 👊'
              colorIndex="brand"/> }

        <Anchor primary={true} label="Go back to the main page" animateIcon={true} icon={<HomeIcon />} path={{path: "/"}} />
      </Box>
    )
  }
})
