import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"
import { Provider as UNSTATEDProvider } from "unstated"
import UNSTATED from "unstated-debug"
import { ApolloClient } from "apollo-client"
import { setContext } from "apollo-link-context"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createUploadLink } from "apollo-upload-client"
import { ApolloProvider } from "react-apollo"
import ReactGA from "react-ga"
import * as serviceWorker from "./serviceWorker"
import BasicContainer from "./unstated/basic"
import { getUserId, getUserRole } from "./lib/jwt"

UNSTATED.logStateChanges = process.env.NODE_ENV !== "production"
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
  debug: process.env.NODE_ENV !== "production"
})

let basic = new BasicContainer({
  initialToken: localStorage.getItem("token") || null,
  initialUsername: localStorage.getItem("username") || null,
  initialRoles: localStorage.getItem("roles") || null,
  initLiteVersion: localStorage.getItem("liteVersion") || "false"
})

const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URI
  // credentials: "include"
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token")
  // return the headers to the context so httpLink can read them
  if (!token) return headers
  // supported roles: user, mod // God has no power here!
  const role = getUserRole(token)
  const userId = getUserId(token)
  ReactGA.set({ userId })
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "X-Hasura-User-Id": getUserId(token),
      "X-Hasura-Role": role === "user" ? "user" : "mod"
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  credentials: "include"
})

ReactDOM.render(
  <UNSTATEDProvider inject={[basic]}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </UNSTATEDProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
