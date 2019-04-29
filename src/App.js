import React from "react"
import { Switch, Route, Link } from "react-router-dom"
import io from "socket.io-client"
import { API_URL } from "./config"
import logo from "./logo.svg"
import "./App.css"
import LoginPage from "./page/LoginPage"
import { Subscribe } from "unstated"
import BasicContainer from "./unstated/basic"

const socket = io(API_URL)

const Blank = () => (
  <Subscribe to={[BasicContainer]}>
    {basic => (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Link className="App-link" to="/login">
            Login
          </Link>
          <button
            onClick={() => {
              basic.logout()
            }}
          >
            Logout
          </button>
        </header>
      </div>
    )}
  </Subscribe>
)

const Page404 = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>404</p>
      <Link className="App-link" to="/">
        Home
      </Link>
    </header>
  </div>
)

const App = () => (
  <Switch>
    <Route
      path="/login"
      component={props => <LoginPage {...props} socket={socket} />}
    />
    <Route path="/" component={Blank} />
    <Route component={Page404} />
  </Switch>
)

export default App
