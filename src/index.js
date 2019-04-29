import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"
import { Provider as UNSTATEDProvider } from "unstated"
import UNSTATED from "unstated-debug"
import * as serviceWorker from "./serviceWorker"
import BasicContainer from "./unstated/basic"

UNSTATED.logStateChanges = process.env.NODE_ENV !== 'production'

let basic = new BasicContainer({
  initialToken: sessionStorage.getItem("token") || null,
  initialUsername: sessionStorage.getItem("username") || null,
  initialRoles: sessionStorage.getItem("roles") || null
})

ReactDOM.render(
  <UNSTATEDProvider inject={[basic]}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UNSTATEDProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
