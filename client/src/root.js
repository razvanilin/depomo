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
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import ForgotPassword from './components/ForgotPassword'
import ProfileSettings from './components/ProfileSettings'
import PaymentMethod from './components/PaymentMethod'

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
      <Route path='tasks' component={Tasks}>
        <Route path='add' component={AddTask}>
          <Route path='payment' component={PaymentMethod} />
        </Route>
      </Route>
      <Route path='settings' component={ProfileSettings} />
    </Route>
    <Route path="/payment" component={ProcessPayment} />
    <Route path="/reset" component={ResetPassword} />
  </Router>
))

// <Route path='counter' component={Counter} />
