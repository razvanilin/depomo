import React from 'react'
import { Component, Goto } from 'jumpsuit';

import LogoImage from '../images/depomo_logo.png';

import App from 'grommet/components/App'
import Sidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Box from 'grommet/components/Box'
import Anchor from 'grommet/components/Anchor'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import Image from 'grommet/components/Image'
import Menu from 'grommet/components/Menu'
import Split from 'grommet/components/Split'

import UserIcon from 'grommet/components/icons/base/User'
import HistoryIcon from 'grommet/components/icons/base/History'
import TrophyIcon from 'grommet/components/icons/base/Trophy'
import PlanIcon from 'grommet/components/icons/base/Plan'

export default Component({
  componentWillMount() {
    console.log(this.props.user);
    if (!this.props.user || !this.props.user._id) {
      Goto({
        path: "/login"
      });
    }
  },
  render() {
    return (
      <App centered={false}>
        <Split flex="right">
          <Sidebar colorIndex="accent-1" fixed={true} size="small">
            <Header pad="medium" justify="between">
              <Title>
                <Image src={LogoImage} fit="contain" full="horizontal"/>
              </Title>
            </Header>

            <Box flex='grow' pad="small">
              <Menu primary={true}>
                <Anchor label="Activities" icon={<PlanIcon />} animateIcon={true} href="" className="active"/>
                <Anchor label="Profile" icon={<UserIcon />} animateIcon={true} href="" />
                <Anchor label="History" icon={<HistoryIcon />} animateIcon={true} href="" />
                <Anchor label="Achievements" icon={<TrophyIcon />} animateIcon={true} href="" />
              </Menu>
            </Box>

            <Footer pad="medium">
              <UserIcon />
              <Menu responsive={true} inline={false} label={this.props.user.email} icon={<UserIcon />} primary={true}>
                <Anchor href="">Profile Settings</Anchor>
                <Anchor href="">Log Out</Anchor>
              </Menu>
            </Footer>
          </Sidebar>

          <Box flex="grow" pad="medium">
            {this.props.children}
          </Box>
        </Split>
      </App>
    )
  }
}, state => ({
  user: state.user
}))
