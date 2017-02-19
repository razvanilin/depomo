import React from 'react'
import { Render, Router, Route, IndexRoute } from 'jumpsuit'
// Styles
import '../node_modules/grommet/scss/vanilla/index.scss';
// State
import states from './state'
// Containers
import App from './containers/App'
// Screens
import Home from './components/Home'
import Counter from './components/Counter'

// Simple Routing
Render(states, (
  <Router>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='counter' component={Counter} />
    </Route>
  </Router>
))
