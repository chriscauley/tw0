import React from 'react'
import { Route, Switch } from 'react-router-dom'
import List from './List'

const path = '/sprites/'

export default function SpriteRoutes() {
  return (
    <Route path={path}>
      <Switch>
        <Route path={path} component={List} />
      </Switch>
    </Route>
  )
}
