import React from 'react'
import { Render, Router, Route } from 'jumpsuit'
// Styles
import '../node_modules/grommet/scss/aruba/index.scss';
// State
import states from './state'

// Containers
import App from './containers/App'
import Dashboard from './containers/Dashboard'
import ProcessPayment from './containers/ProcessPayment'
import ResetPassword from './containers/ResetPassword'

import Login from './components/Login'
import Signup from './components/Signup'
import Activities from './components/Activities'
import AddActivity from './components/AddActivity'
import ForgotPassword from './components/ForgotPassword'

// Screens
// import Home from './components/Home'
// import Counter from './components/Counter'

// Simple Routing
Render(states, (
  <Router>
    <Route path='/' component={App}>
      <Route path='login' component={Login} />
      <Route path='signup' component={Signup} />
      <Route path='forgot' component={ForgotPassword} />
    </Route>
    <Route path='/dashboard' component={Dashboard}>
      <Route path='activities' component={Activities}>
      <Route path='add' component={AddActivity} />
      </Route>
    </Route>
    <Route path="/payment" component={ProcessPayment} />
    <Route path="/reset" component={ResetPassword} />
  </Router>
))

// <Route path='counter' component={Counter} />
