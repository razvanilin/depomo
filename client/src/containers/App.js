import React from 'react'
import { Link } from 'jumpsuit';

import './App.scss';
import '../index.scss';

import HeaderImage from '../images/header1.png';

import App from 'grommet/components/App'
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Hero from 'grommet/components/Hero'
import Section from 'grommet/components/Section'
import Menu from 'grommet/components/Menu'
import Box from 'grommet/components/Box'
import Anchor from 'grommet/components/Anchor'
import GrommetIcon from 'grommet/components/icons/base/BrandGrommetOutline';
import SearchIcon from 'grommet/components/icons/base/Search';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Image from 'grommet/components/Image';

export default React.createClass({
  render() {
    return (
      <App>
        <Article>
          <Header>
            <Box size={{width: {max: 'xxlarge'}}} direction="row"
              responsive={false} justify="center" align="center"
              pad={{horizontal: 'medium'}} flex="grow">
              <GrommetIcon colorIndex="brand" size="large" />
              <Box pad="small" />
              <Menu label="Label" inline={true} direction="row" flex="grow">
                <Anchor href="#">Solutions</Anchor>
                <Anchor href="#">Services</Anchor>
                <Anchor href="#">Products</Anchor>
                <Anchor href="#">About Us</Anchor>
                <Anchor href="#">Support</Anchor>
              </Menu>

              <Box flex="grow" align="end">
                <SearchIcon />
              </Box>
            </Box>
          </Header>
          <Hero background={<Image src={HeaderImage}
            fit='cover'
            align={{"top": true}} />}
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
                  Depomo
                </Heading>
              </Box>
            </Box>

            <Box direction="row" justify="center" align="center">
              <Box pad="small">
                <Link to="login">
                <Button onClick={function() {console.log("hello");}} label='Login' primary={true} />
                </Link>
              </Box>

              <Box pad="small">
                <Button label='Signup' href='#' primary={true} />
              </Box>
            </Box>
          </Hero>
          <Section>
            {this.props.children}
          </Section>
        </Article>
      </App>
    )
  }
})
//
// <div className='App'>
//   <div className='App-header'>
//     <img src={logo} className='App-logo' alt='logo' />
//     <h2>Welcome to React + Jumpsuit!</h2>
//   </div>
//   {this.props.children}
// </div>
