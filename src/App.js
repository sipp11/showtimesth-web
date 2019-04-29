import React from "react"
import { Switch, Route, Link } from "react-router-dom"
import logo from "./logo.svg"
import "./App.css"
import LoginPage from "./page/LoginPage"

const Blank = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Link className="App-link" to="/login">
        Login
      </Link>
    </header>
  </div>
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

const handleSocialAuth = (provider, query) => {
  // const url = `https://passport.everyday.in.th/auth/${provider}/callback${query}`
  // console.log("url: ", url)
  // axios
  //   .get(url)
  //   .then(resp => {
  //     console.log("then:", resp)
  //   })
  //   .catch(function(error) {
  //     // handle error
  //     console.log(error)
  //   })
  //   .then(function() {
  //     // always executed
  //     console.log("then!!")
  //   })
}

const App = () => (
  <Switch>
    <Route
      path="/auth/:provider/callback"
      render={props => {
        const { provider } = props.match.params
        const { search } = props.location
        handleSocialAuth(provider, search)
        return <Blank {...props} />
        // return <Callback {...props} />
      }}
    />
    <Route path="/login" component={LoginPage} />
    <Route path="/" component={Blank} />
    <Route component={Page404} />
  </Switch>
)

export default App
