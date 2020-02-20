import React, { Component } from "react"
import PropTypes from "prop-types"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import { API_URL } from "../config"

export default class OAuth extends Component {
  popup = null
  check = null
  state = {
    user: {},
    disabled: ""
  }

  componentDidMount() {
    const { socket, provider, basic } = this.props

    socket.on(provider, user => {
      // console.log('[socket] socket - on ', user)
      this.setState({ user })
      basic.savePassport(user)
      // console.log('[socket] save to basic ')
      ReactGA.event({
        category: "Login",
        action: `Success with`,
        label: provider
      })
      // console.log('[socket] send to reactga - popup.closed: ', this.popup)
      const { popup } = this
      if (popup && !popup.closed) {
        this.popup.close()
        // console.log('[socket] after close', this.popup.closed, this.popup)
        this.popup = null
      }
      // console.log('[socket] last', this.popup)
    })
  }
  componentWillUnmount() {
    const { check, popup } = this
    if (check) clearInterval(check)
    if (popup) this.popup.close()
  }

  checkPopup() {
    this.check = setInterval(() => {
      const { popup, check } = this
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check)
        this.setState({ disabled: "" })
      }
    }, 1000)
  }

  openPopup() {
    const { provider, socket } = this.props
    const width = 640,
      height = 480
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2
    const url = `${API_URL}/auth/${provider}`
    const query = `?socketId=${socket.id}&provider=${provider}`

    ReactGA.event({
      category: "Login",
      action: `Connect to`,
      label: provider
    })

    return window.open(
      `${url}${query}`,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
    )
  }

  startAuth = () => {
    if (!this.state.disabled) {
      this.popup = this.openPopup()
      this.checkPopup()
      this.setState({ disabled: "disabled" })
    }
  }

  closeCard = () => {
    this.setState({ user: {} })
  }

  render() {
    const { provider } = this.props
    const { disabled } = this.state

    return (
      <div className="button-wrapper fadein-fast">
        <button
          onClick={this.startAuth}
          className={`${provider} ${disabled} button`}
        >
          <FontAwesome name={provider === "line" ? "comment-o" : provider} />
        </button>
      </div>
    )
  }
}

OAuth.propTypes = {
  provider: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
}
