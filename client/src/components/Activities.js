import React from 'react'
import { Component } from 'jumpsuit';

import Section from 'grommet/components/Section'
import Header from 'grommet/components/Header'
import Button from 'grommet/components/Button'

import AddIcon from 'grommet/components/icons/base/Add'

export default Component({
  render() {
    return(
      <Section>
        <Header justify="center">
          <Button label="Add a new activity" icon={<AddIcon />} size="large" primary={true}
            onClick={ () => { console.log("add"); }}
          />
        </Header>
      </Section>
    )
  }
}, state => ({
  user: state.user
}))
