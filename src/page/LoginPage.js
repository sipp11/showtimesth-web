import React, { Component } from "react"
import { Subscribe } from "unstated"
import styled from "styled-components"
import ReactGA from "react-ga"
import BasicContainer from "../unstated/basic"
import OAuth from "../component/OAuth"
import { PROVIDERS } from "../config"
import { PageContainer } from "../lib/piece"
import Navbar from "../component/Navbar"
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
      <PageContainer>
        <Navbar />
        <h1>Login</h1>
        <Box className="login-page">
          {PROVIDERS.map(provider => (
            <OAuth
              provider={provider}
              key={provider}
              socket={socket}
              basic={basic}
            />
          ))}
        </Box>
      </PageContainer>
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
