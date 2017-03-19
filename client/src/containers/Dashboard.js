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
import Button from 'grommet/components/Button'

import UserIcon from 'grommet/components/icons/base/User'
import HistoryIcon from 'grommet/components/icons/base/History'
import TrophyIcon from 'grommet/components/icons/base/Trophy'
import PlanIcon from 'grommet/components/icons/base/Plan'
import CloseIcon from 'grommet/components/icons/base/Close'
import MenuIcon from 'grommet/components/icons/base/Menu'

export default Component({

  componentWillMount() {
    if (window.location.pathname === "/dashboard") {
      Goto({
        path: "/dashboard/activities"
      });
    }
    if (!this.props.user || !this.props.user._id) {
      Goto({
        path: "/login"
      });
    }

    this.state = {showMenu: true, responsive: 'multiple'};
  },

  _onResponsive(responsive) {
    this.setState({responsive: responsive});
    if ('multiple' === responsive) {
      this.setState({showMenu: true});
    }
    if ('single' === responsive) {
      this.setState({showMenu: false});
    }
  },

  _onMenuOpen () {
    this.setState({showMenu: true});
    // this._renderMenu();
    console.log("On Menu Open");
  },

  _onMenuClick () {
    if ('single' === this.state.responsive) {
      this.setState({showMenu: false});
    }
    //this.refs.doc.scrollTop = 0;
  },

  _renderTitle (invert) {
    if (!invert) {
      return (
        <Title>
          <Image src={LogoImage} fit="contain" full="horizontal"/>
        </Title>
      );
    } else {
      return;
    }
  },

  _renderMenu() {
    const title = this._renderTitle(false);
    let closer;
    if ('single' === this.state.responsive) {
      closer = (
        <Button icon={<CloseIcon />} onClick={this._onMenuClick} />
      );
    }
    return (
      <Sidebar colorIndex="accent-1" fixed={true} size="small">
        <Header pad="medium" justify="between">
          {title}
          {closer}
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
          <Menu responsive={true} inline={false} label={this.props.user.name} icon={<UserIcon />} primary={true}>
            <Anchor href="">Profile Settings</Anchor>
            <Anchor href="">Log Out</Anchor>
          </Menu>
        </Footer>
      </Sidebar>
    )
  },

  _renderDoc () {
    let header;
    if ('single' === this.state.responsive) {
     header = (
       <Header justify='between' size='medium' pad={{horizontal: 'medium'}} fixed={true}>
         <Menu direction='row' responsive={false}>
           <Anchor label="Menu" animateIcon={true} icon={<MenuIcon />} onClick={this._onMenuOpen} />
         </Menu>
       </Header>
     );
    }
    return (
      <Box flex="grow" pad="medium">
        {header}
        {this.props.children}
      </Box>
    );
  },

  render() {
    let priority = ('single' === this.state.responsive && this.state.showMenu ?
      'left' : 'right');
    return (
      <App centered={false}>
        <Split flex="right" priority={priority} onResponsive={this._onResponsive} fixed={true}>
          {this._renderMenu()}
          {this._renderDoc()}
        </Split>
      </App>
    )
  }
}, state => ({
  user: state.user
}))
