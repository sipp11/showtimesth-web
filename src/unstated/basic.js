import { Container } from "unstated"
import { getUserId } from '../lib/jwt'

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

  getUserId = () => {
    if (this.state.token === null) return -1
    return getUserId(this.state.token)
  }

  logout = client => {
    this.setState({
      token: null,
      username: null,
      roles: null
    })
    sessionStorage.clear()
    if (client) client.resetStore()
  }
}

export default BasicContainer
