import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import sprites from './sprites'
import Coloseum from './coloseum'
import Look from './coloseum/Look'
import Play from './coloseum/Play'

const App = () => {
  return (
    <HashRouter>
      <sprites.routes />
      <Route path="/coloseum/" component={Coloseum} />
      <Route path="/look/" component={Look} />
      <Route path="/play/" component={Play} />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
