import React, { Component } from "react"
import { Link } from "react-router-dom"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import ReactGA from "react-ga"
import NowShowing from "../component/movie/Nowshowing"
import Navbar from "../component/Navbar"
import { PageContainer } from "../lib/piece"
import ComingSoon from "../component/movie/Comingsoon"

const HeaderLink = styled(props => <Link {...props} />)`
  margin-left: 1.2rem;
  font-size: 0.95rem;

  color: #808a96;

  @media screen and (min-width: 450px) {
    :hover {
      color: #e3e3e3;
    }
  }
`

class AppPage extends Component {
  renderComingSoon() {
    ReactGA.pageview("/comingsoon")
    return (
      <>
        <h1>
          <FontAwesome name="film" /> Coming soon
          <HeaderLink to="/">Now showing</HeaderLink>
        </h1>
        <ComingSoon />
      </>
    )
  }
  renderNowShowing() {
    ReactGA.pageview("/")
    return (
      <>
        <h1>
          <FontAwesome name="film" /> Now showing
          <HeaderLink to="/comingsoon">Coming soon</HeaderLink>
        </h1>
        <NowShowing />
      </>
    )
  }

  render() {
    const { page } = this.props.match.params
    return (
      <PageContainer>
        <Navbar />
        {page === "comingsoon" && this.renderComingSoon()}
        {page !== "comingsoon" && this.renderNowShowing()}
      </PageContainer>
    )
  }
}

export default AppPage
