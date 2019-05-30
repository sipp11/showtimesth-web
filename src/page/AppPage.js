import React, { Component } from "react"
import { Link } from "react-router-dom"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import ReactGA from "react-ga"
import NowShowing from "../component/movie/Nowshowing"
import Navbar from "../component/Navbar"
import { PageContainer } from "../lib/piece"
import ComingSoon from "../component/movie/Comingsoon"
import Chain from "../component/theater/Chain"
import List from "../component/theater/List"

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
    ReactGA.pageview("/nowshowing")
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

  renderTheaterList(_, subpage) {
    ReactGA.pageview(`/list${subpage !== undefined ? `/${subpage}` : ""}`)
    return (
      <>
        {!subpage && <Chain />}
        {subpage && <List subpage={subpage} />}
      </>
    )
  }

  render() {
    const { page, subpage } = this.props.match.params
    let child = this.renderNowShowing()
    if (page === "comingsoon") {
      child = this.renderComingSoon()
    } else if (page === "list") {
      child = this.renderTheaterList(this, subpage)
    }
    return (
      <PageContainer>
        <Navbar />
        {child}
      </PageContainer>
    )
  }
}

export default AppPage
