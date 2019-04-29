import React, { Component } from "react"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"

class LoginPage extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="http://localhost:8080/auth/twitter">Twitter</a>
          </li>
          <li>
            <a href="https://passport.everyday.in.th/auth/google">Google</a>
          </li>
          <li>
            <a href="https://passport.everyday.in.th/auth/facebook">Facebook</a>
          </li>
        </ul>
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
