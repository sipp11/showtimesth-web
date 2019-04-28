import { Container } from "unstated"

class BasicContainer extends Container {
  constructor(props = {}) {
    super()
    this.state = {
      jwtToken: props.sessionToken || null
    }
  }

  saveToken = jwtToken => {
    sessionStorage.setItem("jwtToken", jwtToken)
    this.setState({ jwtToken })
  }
}

export default BasicContainer
