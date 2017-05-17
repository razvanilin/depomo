import React from 'react'
import { Link } from 'jumpsuit';
import cookie from 'react-cookie';

import login from "../actions/login";

import './App.scss';
import '../index.scss';

// import HeaderImage from '../images/header1.png';
import HeaderImage from '../images/cloud_blur.jpg'
import LogoImage from '../images/depomo_logo_light.png'
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
import Label from 'grommet/components/Label'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import SocialShare from 'grommet/components/SocialShare'

import BetaRegistration from '../components/BetaRegistration'
import settings from '../settings'

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
            backgroundColorIndex='dark'
            size={this.state.mobile ? 'medium' : 'large'}>
            {!this.state.mobile &&
              <Header style={{position:"absolute", top: "5px", left: "0px"}}>
                <Box size={{width: {max: 'xxlarge'}}} direction="row"
                  responsive={false} justify="center" align="center"
                  pad={{horizontal: 'medium'}} flex="grow">
                  <Image style={{width: "10.5em"}} src={LogoImage} />
                  <Box pad="small" />
                  <Menu label="Menu" inline={true} direction="row" flex="grow">
                    <Anchor primary={true} href="#how-section">How it works</Anchor>
                  </Menu>
                </Box>
              </Header>
            }
            {this.state.mobile &&
              <Heading tag="h4" align="center" style={{color:"white", position: 'absolute', top: "60px"}}>
                <Image src={LogoImage} />
                Depomo comes to the rescue when procrastination becomes a problem
              </Heading>
            }
            {!this.state.mobile &&
            <Box direction='row'
              justify='center'
              align='center'>
              <Box
                align='center'
                pad='large'
                margin={{top:"large"}}
                >
                <Heading strong={true} align="center" tag="h2" style={{maxWidth: "900px"}}>
                  Depomo comes to the rescue when procrastination becomes a problem
                </Heading>
              </Box>
            </Box>
            }

            {!this.state.userLoaded && settings.env !== 'production' &&
              <Box pad="medium" justify="center" align="center">
                {this.state.mobile && <Heading tag="h3" align="center">Procrastination is no longer an issue</Heading>}
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
              </Box>
            }

            {settings.env === 'production' &&
              <Box margin={{top:"medium"}} justify="center" align="center">
                <BetaRegistration />
              </Box>
            }

            {this.state.userLoaded &&
              <Box justify="center" align="center">
                <Button primary={true} label="Go to your dashboard" icon={<LinkNext />} path="/dashboard/tasks" />
              </Box>
            }

            <Box direction="column" justify="center" align="center" pad="small" margin={{bottom:"medium"}}>
              <Label size="small" style={{padding: "0px"}} margin="none">Spread the word 😻</Label>
              <Box responsive={false} direction="row" justify="center" align="center">
                <SocialShare type="facebook" link="https://depomo.com" />
                <SocialShare type="twitter" link="https://depomo.com" text="Just came across this app 🙀 that uses deposits to break your procrastination 💪 😻" />
                <SocialShare type="linkedin" link="https://depomo.com" text="A novel way to break procrastination using deposits. Check it out 👇" />
                <SocialShare type="google" link="https://depomo.com" />
              </Box>
            </Box>

          </Hero>

          <Section style={{padding: "0px"}}>
            <Box direction="column" justify="center" align="center">
              <Box full="horizontal" colorIndex="brand" direction="column" justify="center" align="center">

                <Box className="cloud-bg" pad="medium" full="horizontal" direction="column" justify="center" align="center">

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
              </Box>

              <Box full="horizontal" colorIndex="accent-1" direction="row" justify="center" align="center">
                <Box className="cloud-bg-down" pad="medium" full="horizontal" direction="row" justify="center" align="center">
                  <Box direction="column" justify="center">
                    <Box pad="large" justify="center" align="start">
                      <Heading tag="h3">Scenario 1. Completed the task in time 😼</Heading>
                      <Paragraph>
                        Congratulations! You conquered procrastination and you get to keep your deposit.
                      </Paragraph>
                    </Box>
                    <Box pad="large" justify="center" align="start">
                      <Heading tag="h3">Scenarion 2. Not completed the task on time 🙀</Heading>
                      <Paragraph>
                        Your deposit will be automatically extracted from your account.
                        <strong> Not to worry</strong>, Depomo will use all the profits to develop the service more and to help build schools in the poor regions of Africa 🏫.
                        All users will receive detailed monthly expenses and the amount sent towards charities.
                      </Paragraph>
                    </Box>
                  </Box>
                  <Image size="small" full={false} fit="contain" src={CharTwo} />
                </Box>
              </Box>


              <Box colorIndex="brand" full="horizontal" direction="column" justify="center" align="center">
                <Box className="cloud-bg-center" full="horizontal" pad="medium" direction="column" justify="center" align="center">

                  <Heading id="calendar-section" align="center" tag="h2">Google Calendar Integration 📆</Heading>

                  <Box pad="medium" direction="column" justify="center" align="center">
                    <Heading tag="h3" align="center">No need to spend time learning a new tool</Heading>
                    <Paragraph>
                       You can now record tasks automatically using your Google Calendar. Watch the Demo video to see how it works.
                    </Paragraph>
                  </Box>

                  <div className="videowrapper">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/A5k6S1qz_Ns" frameBorder="0" allowFullScreen></iframe>
                  </div>
                </Box>
              </Box>

              <Box full="horizontal" direction="column" justify="center" align="center" colorIndex="accent-1">
                <Box className="cloud-bg" full="horizontal" pad="medium" direction="column" justify="center" align="center">

                  <Heading tag="h2">Transparency First</Heading>
                  <Paragraph size="large">
                    Depomo will use all the profits to better develop this service and to help build schools in the poor African regions.
                    Each month, there will be a financial report made available to everyone here on the website.
                    This way you will be able to follow us in the journey of conquering procrastination and help educating children along the way.
                  </Paragraph>

                  {settings.env === 'production' &&
                    <Box pad="large" justify="center" align="center">
                      <BetaRegistration />
                    </Box>
                  }
                </Box>
              </Box>
            </Box>

          </Section>

          {this.props.children &&
          <Section>
            {this.props.children}
          </Section>
          }

          <Footer colorIndex="brand" pad={{horizontal:"large"}} justify="between">
            <Title>Depomo</Title>
            {!this.state.mobile && <Box align="center" pad={{between: "medium"}}>
              <Paragraph>Made with 😻 in Edinburgh</Paragraph>
            </Box>}
            <Box align="center" pad={{between: "medium"}}>
              <Paragraph>© 2017 Depomo Ltd.</Paragraph>
            </Box>
          </Footer>

        </Article>
      </App>
    )
  }
}, state => ({
  user: state.user
}))
