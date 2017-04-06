import React from 'react'
import { Render, Router, Route } from 'jumpsuit'
// Styles
import '../node_modules/grommet/scss/aruba/index.scss';
// State
import states from './state'

// Containers
import App from './containers/PreLaunch'
// import Dashboard from './containers/Dashboard'
// import ProcessPayment from './containers/ProcessPayment'
// import ResetPassword from './containers/ResetPassword'
//
// import Login from './components/Login'
// import Signup from './components/Signup'
// import Tasks from './components/Tasks'
// import AddTask from './components/AddTask'
// import ForgotPassword from './components/ForgotPassword'

// Screens
// import Home from './components/Home'
// import Counter from './components/Counter'

// Simple Routing
Render(states, (
  <Router>
    <Route path='/' component={App}/>
  </Router>
))

// <Route path='counter' component={Counter} />
