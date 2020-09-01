import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'

import sprites from './sprites'
import Coloseum from './coloseum'
import Look from './coloseum/Look'
import Play from './coloseum/Play'

const keyMap = {
  TOGGLE_HELP: ['/', '?', 'shift+?'],
}

const App = () => {
  const handlers = {
    TOGGLE_HELP: () => alert('TODO help!'),
  }
  return (
    <HashRouter>
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <sprites.routes />
      <Route path="/coloseum/" component={Coloseum} />
      <Route path="/look/" component={Look} />
      <Route path="/play/:pieces/" component={Play} />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
