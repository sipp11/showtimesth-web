import { Container } from "unstated"
import { getUserId } from "../lib/jwt"

class BasicContainer extends Container {
  constructor(props = {}) {
    super()
    this.state = {
      token: props.initialToken || null,
      username: props.initialUsername || null,
      roles: props.initialRoles || null,
      liteVersion: props.initLiteVersion || "false"
    }
  }

  updatePref = (key, value) => {
    let d = {}
    d[key] = value
    localStorage.setItem(key, value)
    this.setState(d)
  }

  togglePref = key => {
    let d = {}
    const currValue = this.state[key] === "true"
    d[key] = !currValue
    localStorage.setItem(key, !currValue)
    this.setState(d)
  }

  getPref = key => {
    return this.state[key]
  }

  savePassport = user => {
    const { username, roles, token } = user
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("roles", roles.join(","))
    this.setState({ ...user })
  }

  saveToken = token => {
    localStorage.setItem("token", token)
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
    localStorage.clear()
    if (client) client.resetStore()
  }
}

export default BasicContainer
