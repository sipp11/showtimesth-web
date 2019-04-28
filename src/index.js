import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider as UNSTATEDProvider } from "unstated"
import UNSTATED from "unstated-debug"
import * as serviceWorker from "./serviceWorker"
import BasicContainer from "./unstated/basic"

UNSTATED.logStateChanges = false

let basic = new BasicContainer({
  initialToken: sessionStorage.getItem("jwtToken") || null
})

ReactDOM.render(
  <UNSTATEDProvider inject={[basic]}>
    <App />
  </UNSTATEDProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
