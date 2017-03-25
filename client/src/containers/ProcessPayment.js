import React from 'react'
import { Component } from 'jumpsuit'

import LogoImage from '../images/depomo_logo.png';

import App from 'grommet/components/App'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Image from 'grommet/components/Image'

import Spinning from 'grommet/components/icons/Spinning'

import processPayment from '../actions/processPayment'

export default Component({

  componentWillMount() {
    processPayment();
  },

  render() {
    return (
      <App>
        <Header direction="column" align="center" splash={true}>
          <Image size="large" src={LogoImage} />
          <Heading tag="h3">Processing payment...</Heading>
          <Heading><Spinning /></Heading>
        </Header>
      </App>
    )
  }
})
