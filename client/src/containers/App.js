import React from 'react'
import { Link } from 'jumpsuit';
import cookie from 'react-cookie';

import login from "../actions/login";

import './App.scss';
import '../index.scss';

// import HeaderImage from '../images/header1.png';
import HeaderImage from '../images/cloud.jpg'
import LogoImage from '../images/depomo_logo.png'
import DepomotyImage from '../images/depomo_logo4.png'
import CharOne from '../images/Character1.png'
import CharTwo from '../images/Character2.png'

import App from 'grommet/components/App'
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Hero from 'grommet/components/Hero'
import Section from 'grommet/components/Section'
import Menu from 'grommet/components/Menu'
import Box from 'grommet/components/Box'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Heading from 'grommet/components/Heading'
import Image from 'grommet/components/Image'
import LinkNext from 'grommet/components/icons/base/LinkNext'
import Paragraph from 'grommet/components/Paragraph'
import Responsive from 'grommet/utils/Responsive'


export default React.createClass({
  componentWillMount() {
    this.state = {
      userLoaded: false,
      mobile: false
    }
    if (cookie.load("token")) {
      login(null, cookie.load("token"), (success)=>{
        if (success) this.setState({userLoaded: true});
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

  render() {
    return (
      <App centered={false}>
        <Article colorIndex="accent-1">
          <Hero background={
            <Image src={HeaderImage}
            fit='cover'
            full={true}
            align={{"bottom": true}} />
          }
            backgroundColorIndex='light'
            size={this.state.mobile ? 'medium' : 'large'}>
            <Header style={{position:"absolute", top: "10px", left: "10px"}}>
              <Box size={{width: {max: 'xxlarge'}}} direction="row"
                responsive={false} justify="center" align="center"
                pad={{horizontal: 'medium'}} flex="grow">
                <Image style={{width: "3.5em"}} src={DepomotyImage} />
                <Box pad="small" />
                <Menu label="Menu" inline={true} direction="row" flex="grow">
                  <Anchor primary={true} href="#how-section">How it works</Anchor>
                </Menu>
              </Box>
            </Header>
            {this.state.mobile &&
              <Heading margin='none' style={{position: 'absolute', top: "80px"}}>
                <Image src={LogoImage} />
              </Heading>
            }
            {!this.state.mobile &&
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
            }

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

          <Section style={{padding: "0px"}}>
            <Box direction="column" justify="center" align="center">
              <Box pad="medium" full="horizontal" colorIndex="brand" direction="column" justify="center" align="center">
                <Heading id="how-section" tag="h2">How does it work?</Heading>

                <Box direction="row" justify="center" align="center">
                  {!this.state.mobile && <Image size="small" full={false} fit="contain" src={CharOne} />}
                  <Box direction="column" justify="center">
                    <Box pad="large" justify="center" align="start">
                      <Heading tag="h3">Step 1. Create a task 📝</Heading>
                      <Paragraph>
                        Create a task and place a deadline for it. This can be done here on Depomo or on <Anchor href="#calendar-section" label="Google Calendar"/> after connecting your calendar with Depomo.
                      </Paragraph>
                    </Box>
                    <Box pad="large" justify="center" align="start">
                      <Heading tag="h3">Step 2. Place a deposit 💰</Heading>
                      <Paragraph>
                        Select your desired amount for the deposit that will be at stake to complete the task.
                      </Paragraph>
                    </Box>
                    <Box pad="large" justify="center" align="start">
                      <Heading tag="h3">Step 3. Do your best to complete the task 🏃</Heading>
                      <Paragraph>
                        The deposit you placed before will help you concentrate on  your task and complete it in time.
                        What will happen if not? Check below...
                      </Paragraph>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box pad="medium" full="horizontal" colorIndex="accent-1" direction="row" justify="center" align="center">
                <Box direction="column" justify="center">
                  <Box pad="large" justify="center" align="start">
                    <Heading tag="h3">Scenario 1. Complete the task in time 😼</Heading>
                    <Paragraph>
                      Congratulations! You conquered procrastination and you get to keep your deposit.
                    </Paragraph>
                  </Box>
                  <Box pad="large" justify="center" align="start">
                    <Heading tag="h3">Scenarion 2. Not completed the task on time 🙀</Heading>
                    <Paragraph>
                      Your deposit will be automatically extracted from your account.

                      <strong>Not to worry</strong>, Depomo will use all the profits to develop the service more and to help build schools in the poor regions of Africa 🏫.
                      All users will receive detailed monthly expenses and the amount sent towards charities.
                    </Paragraph>
                  </Box>
                </Box>
                <Image size="small" full={false} fit="contain" src={CharTwo} />
              </Box>


              <Box colorIndex="brand" full="horizontal" pad="medium" direction="column" justify="center" align="center">
                <Heading id="calendar-section" tag="h2">Google Calendar Integration 📆</Heading>

                <Box pad="medium" direction="column" justify="center" align="center">
                  <Heading tag="h3">No need to spend time learning a new tool</Heading>
                  <Paragraph>
                     You can now record tasks automatically using your Google Calendar. Watch the Demo video to see how it works.
                  </Paragraph>
                </Box>
              </Box>
              <Box className="videowrapper">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/A5k6S1qz_Ns" frameborder="0" allowfullscreen></iframe>
              </Box>

              <Box full="horizontal" pad="medium" direction="column" justify="center" align="center" colorIndex="accent-1">
                <Heading tag="h2">Transparency First</Heading>
                <Paragraph size="large">
                  Depomo will use all the profits to better develop this service and to help build schools in the poor African regions.
                  Each month, there will be a financial report made available to everyone here on the website.
                  This way you will be able to follow us in the journey of conquering procrastination and help educating children along the way.
                </Paragraph>
              </Box>
            </Box>

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
