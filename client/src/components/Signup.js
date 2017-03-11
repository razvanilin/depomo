import React from 'react';
import { Link } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';

export default React.createClass({
  render() {
    return(
      <Layer closer={true} flush={true}>
        <Box pad="medium" align="end" justify="start" alignContent="end">
          <Link to="/"><CloseIcon /></Link>
        </Box>
        <Box align="center" justify="center">
          <Form pad="medium">
            <Header align="center" justify="center">
              <Heading strong={true} align="center">
                Signup
              </Heading>
            </Header>

            <FormField label="Name"><TextInput /></FormField>
            <FormField label="Email"><TextInput /></FormField>
            <FormField label="Password"><TextInput /></FormField>

            <FormField>
              <CheckBox id='agree'
                name='agree'
                label='I agree with the Terms & Conditions' />
            </FormField>

            <Footer pad={{"vertical": "medium"}} justify="center">
              <Button label='Join depomo'
                type='submit'
                primary={true}
                align="center"
                style={{width:"100%"}}
                onClick={function() { console.log("join");}} />
            </Footer>
          </Form>
        </Box>
      </Layer>
    )
  }
});
