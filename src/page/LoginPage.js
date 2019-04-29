import React, { Component } from "react"
import io from "socket.io-client"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import OAuth from "../component/OAuth"
import { API_URL, PROVIDERS } from "../config"
import "./LoginPage.css"

class LoginPage extends Component {
  socket = null

  componentWillMount() {
    this.socket = io(API_URL)
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  }

  render() {
    return (
      <div className="container">
        {PROVIDERS.map(provider => (
          <OAuth provider={provider} key={provider} socket={this.socket} />
        ))}
      </div>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <LoginPage {...props} basic={basic} />}
    </Subscribe>
  )
}
