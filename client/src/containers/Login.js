import React from 'react';
import { Link } from 'jumpsuit';
// grommet
import Layer from 'grommet/components/Layer';
import Anchor from 'grommet/components/Anchor';
import LoginForm from 'grommet/components/LoginForm';
import Box from 'grommet/components/Box';

// grommet icons
import CloseIcon from 'grommet/components/icons/base/Close';

export default React.createClass({
  render() {
    return(
      <Layer closer={true}>
      <Box pad="medium" align="end" justify="end" alignContent="end">
        <Link to="/"><CloseIcon /></Link>
      </Box>
      <LoginForm
        title='Login'
        forgotPassword={<Anchor href='#'
        label='Forgot password?' />} />
      </Layer>
    )
  }
});
