import React, { Component } from "react"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import NowShowing from "../component/movie/Nowshowing"
import Navbar from "../component/Navbar"
import { HeaderLink, PageContainer } from "../lib/piece"
import ComingSoon from "../component/movie/Comingsoon"
import Chain from "../component/theater/Chain"
import List from "../component/theater/List"

class AppPage extends Component {
  renderComingSoon(props) {
    ReactGA.pageview("/comingsoon")
    const { basic, history } = props
    return (
      <>
        <h1>
          <FontAwesome name="film" /> Coming soon
          <HeaderLink to="/">Now showing</HeaderLink>
        </h1>
        <ComingSoon basic={basic} history={history} />
      </>
    )
  }
  renderNowShowing(props) {
    ReactGA.pageview("/nowshowing")
    const { basic, history } = props
    return (
      <>
        <h1>
          <FontAwesome name="film" /> Now showing
          <HeaderLink to="/comingsoon">Coming soon</HeaderLink>
        </h1>
        <NowShowing basic={basic} history={history} />
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
    let child = this.renderNowShowing(this.props)
    if (page === "comingsoon") {
      child = this.renderComingSoon(this.props)
    } else if (page === "list") {
      child = this.renderTheaterList(this, subpage)
    }
    return (
      <PageContainer>
        <Navbar location={this.props.location} />
        {child}
      </PageContainer>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <AppPage {...props} basic={basic} />}
    </Subscribe>
  )
}
