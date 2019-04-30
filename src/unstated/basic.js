import { Container } from "unstated"

class BasicContainer extends Container {
  constructor(props = {}) {
    super()
    this.state = {
      token: props.initialToken || null,
      username: props.initialUsername || null,
      roles: props.initialRoles || null
    }
  }

  savePassport = user => {
    const { username, roles, token } = user
    sessionStorage.setItem("token", token)
    sessionStorage.setItem("username", username)
    sessionStorage.setItem("roles", roles.join(","))
    this.setState({ ...user })
  }

  saveToken = token => {
    sessionStorage.setItem("token", token)
    this.setState({ token })
  }

  logout = () => {
    this.setState({
      token: null,
      username: null,
      roles: null
    })
    sessionStorage.clear()
  }
}

export default BasicContainer
