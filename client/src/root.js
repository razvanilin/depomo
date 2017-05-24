import React from 'react'
import { Render, Router, Route, IndexRedirect } from 'jumpsuit'
// Styles
import '../node_modules/grommet/scss/aruba/index.scss';
// State
import states from './state'

// Containers
import App from './containers/App'
import Dashboard from './containers/Dashboard'
import ProcessPayment from './containers/ProcessPayment'
import ResetPassword from './containers/ResetPassword'
import NotFound from './containers/NotFound'
import UpdateNotifications from './containers/UpdateNotifications'
import CompletionScreen from './containers/CompletionScreen'

import Login from './components/Login'
import Signup from './components/Signup'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import ForgotPassword from './components/ForgotPassword'
import ProfileSettings from './components/ProfileSettings'
import PaymentMethod from './components/PaymentMethod'
import GoogleCalendar from './components/GoogleCalendar'
import Profile from './components/Profile'
import History from './components/History'
import Task from './components/Task'

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
      <IndexRedirect to='/dashboard/tasks' />
      <Route path='tasks' component={Tasks}>
        <Route path='add' component={AddTask}>
          <Route path='payment' component={PaymentMethod} />
        </Route>
        <Route path=':id' component={Task} />
      </Route>
      <Route path='settings' component={ProfileSettings} />
      <Route path='integration' component={GoogleCalendar} />
      <Route path='profile' component={Profile} />
      <Route path='history' component={History} />
    </Route>
    <Route path="/payment" component={ProcessPayment} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/notifications" component={UpdateNotifications} />
    <Route path="/complete" component={CompletionScreen} />

    <Route path="*" component={NotFound} />
  </Router>
))

// <Route path='counter' component={Counter} />
