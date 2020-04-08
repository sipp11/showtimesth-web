import React, { Component } from "react"
import { Helmet } from "react-helmet"
import { Subscribe } from "unstated"
import styled from "styled-components"
import ReactGA from "react-ga"
import BasicContainer from "../unstated/basic"
import OAuth from "../component/OAuth"
import { PROVIDERS } from "../config"
import { PageContainer } from "../lib/piece"
import Navbar from "../component/Navbar"
import { version, versionDate } from "../../package.json"
import "./LoginPage.css"

const Box = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`

class LoginPage extends Component {
  componentDidMount() {
    ReactGA.pageview("/login")
  }
  UNSAFE_componentWillMount() {
    const { basic, history } = this.props
    if (basic.state.token !== null) {
      history.push("/")
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      <PageContainer>
        <Helmet>
          <title>Sign in | ShowtimesTH</title>
        </Helmet>
        <Navbar location={this.props.location} />
        <h1>Login</h1>

        <Box className="login-page">
          {PROVIDERS.map((provider) => (
            <OAuth
              provider={provider}
              key={provider}
              socket={socket}
              basic={basic}
            />
          ))}
        </Box>

        <Box>
          <small className="muted">
            v{version}-{versionDate}
          </small>
        </Box>
      </PageContainer>
    )
  }
}

export default (props) => {
  return (
    <Subscribe to={[BasicContainer]}>
      {(basic) => <LoginPage {...props} basic={basic} />}
    </Subscribe>
  )
}
