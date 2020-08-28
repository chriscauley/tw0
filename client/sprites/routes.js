import React from 'react'
import { Route, Switch } from 'react-router-dom'
import List from './List'

export default () => (
  <Route path="/sprites/">
    <Switch>
      <Route path="/sprites/" component={List} />
    </Switch>
  </Route>
)