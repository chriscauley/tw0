import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import sprites from './sprites'
import Coloseum from './coloseum'


const App = () => {
  return (
    <HashRouter>
      <sprites.routes/>
      <Route path="/coloseum/" component={Coloseum}/>
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)