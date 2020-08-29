import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import sprites from './sprites'
import Coloseum from './coloseum'
import Look from './coloseum/Look'

const App = () => {
  return (
    <HashRouter>
      <sprites.routes />
      <Route path="/coloseum/" component={Coloseum} />
      <Route path="/look/" component={Look} />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
