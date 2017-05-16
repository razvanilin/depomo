import React from 'react'
import { Link } from 'jumpsuit';
import cookie from 'react-cookie';

import login from "../actions/login";

import './App.scss';
import '../index.scss';

// import HeaderImage from '../images/header1.png';
import HeaderImage from '../images/clouds.jpeg'
import LogoImage from '../images/depomo_logo.png'
import DepomotyImage from '../images/depomo_logo4.png'
import InfographicImage from '../images/Infographic_jpg.jpg'

import App from 'grommet/components/App'
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Hero from 'grommet/components/Hero'
import Section from 'grommet/components/Section'
import Menu from 'grommet/components/Menu'
import Box from 'grommet/components/Box'
import Anchor from 'grommet/components/Anchor'
import GrommetIcon from 'grommet/components/icons/base/BrandGrommetOutline'
import Button from 'grommet/components/Button'
import Heading from 'grommet/components/Heading'
import Image from 'grommet/components/Image'
import LinkNext from 'grommet/components/icons/base/LinkNext'

export default React.createClass({
  componentWillMount() {
    this.state = {
      userLoaded: false
    }
    if (cookie.load("token")) {
      login(null, cookie.load("token"), (success)=>{
        if (success) this.setState({userLoaded: true});
      });
    }
  },
  render() {
    return (
      <App centered={false}>
        <Article>
          <Header>
            <Box size={{width: {max: 'xxlarge'}}} direction="row"
              responsive={false} justify="center" align="center"
              pad={{horizontal: 'medium'}} flex="grow">
              <Image style={{width: "3.5em"}} src={DepomotyImage} />
              <Box pad="small" />
              <Menu label="Menu" inline={true} direction="row" flex="grow">
                <Anchor href="#">How it works</Anchor>
                <Anchor href="#">About</Anchor>
              </Menu>
            </Box>
          </Header>
          <Hero background={<Image src={HeaderImage}
            fit='cover'
            full={true}
            align={{"left": true}} />}
            backgroundColorIndex='dark'
            size='large'>
            <Box direction='row'
              justify='center'
              align='center'>
              <Box
                align='center'
                pad='medium'
                >
                <Heading margin='none'>
                  <Image src={LogoImage} />
                </Heading>
              </Box>
            </Box>

            {!this.state.userLoaded &&
              <Box responsive={false} direction="row" justify="center" align="center">
                <Box pad="small">
                  <Link to="login">
                    <Button onClick={function() {console.log("login");}} label='Login' primary={true} />
                  </Link>
                </Box>

                <Box pad="small">
                  <Link to="signup">
                    <Button onClick={function() {console.log("signup");}} label='Signup' primary={true} />
                  </Link>
                </Box>
              </Box>
            }

            {this.state.userLoaded &&
              <Box justify="center" align="center">
                <Button primary={true} label="Go to your dashboard" icon={<LinkNext />} path="/dashboard/tasks" />
              </Box>
            }
          </Hero>

          <Section style={{padding: "0px", margin: "0px"}}>
          <Image style={{margin: "0px"}} src={InfographicImage} fit="cover" full="horizontal"/>

          </Section>

          <Section>
            {this.props.children}
          </Section>
        </Article>
      </App>
    )
  }
}, state => ({
  user: state.user
}))
