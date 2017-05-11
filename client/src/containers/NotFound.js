import React from 'react'
import { Component } from 'jumpsuit'

import LogoImage from '../images/depomo_logo.png';

import Heading from 'grommet/components/Heading'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Image from 'grommet/components/Image'
import HomeIcon from 'grommet/components/icons/base/Home'

export default Component({
  componentWillMount() {

  },

  render() {
    return(
      <Box pad="large" justify="center" align="center" direction="column">
        <Image size="large" src={LogoImage}/>

        <Heading tag="h2">The page you were looking for cannot be found 😿</Heading>
        <Anchor primary={true} label="Go back to the main page" animateIcon={true} icon={<HomeIcon />} path={{path: "/"}} />
      </Box>
    )
  }
})
