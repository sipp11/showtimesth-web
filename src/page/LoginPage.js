import React, { Component } from "react"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import OAuth from "../component/OAuth"
import { PROVIDERS } from "../config"
import "./LoginPage.css"

class LoginPage extends Component {
  componentWillMount() {
    const { basic, history } = this.props
    if (basic.state.token !== null) {
      history.push("/")
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props
    const { basic } = nextProps
    if (basic.state.token !== null) {
      history.push("/")
    }
  }

  render() {
    const { basic, socket } = this.props
    if (socket === null) return <div />

    return (
      <div className="container">
        {PROVIDERS.map(provider => (
          <OAuth
            provider={provider}
            key={provider}
            socket={socket}
            basic={basic}
          />
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
