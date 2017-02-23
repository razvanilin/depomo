import React from 'react'
import { Render, Router, Route } from 'jumpsuit'
// Styles
import '../node_modules/grommet/scss/vanilla/index.scss';
// State
import states from './state'
// Containers
import App from './containers/App'
import Login from './components/Login'

// Screens
// import Home from './components/Home'
// import Counter from './components/Counter'

// Simple Routing
Render(states, (
  <Router>
    <Route path='/' component={App}>
      <Route path='login' component={Login} />
    </Route>
  </Router>
))

// <Route path='counter' component={Counter} />
