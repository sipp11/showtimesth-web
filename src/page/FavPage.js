import React, { Component } from "react"
import { Helmet } from "react-helmet"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import Navbar from "../component/Navbar"
import FavTheater from "../component/theater/Fav"
import MyFavMovie from "../component/movie/Fav"
import { PageContainer, HeaderLink } from "../lib/piece"

class FavPage extends Component {
  componentDidMount() {
    const {
      match: {
        params: { what },
      },
    } = this.props
    // there is only 2 pages: theater (default) or movie
    const favWhat = what !== "movie" ? "theater" : "movie"
    ReactGA.pageview(`/fav/${favWhat}`)
  }

  renderFavTheater() {
    return (
      <>
        <h1>
          <FontAwesome name="heart" /> Theater
          <HeaderLink to="/fav/movie">Movie</HeaderLink>
        </h1>
        <FavTheater />
      </>
    )
  }

  renderFavMovie(params, history) {
    return (
      <>
        <h1>
          <FontAwesome name="heart" /> Movie
          <HeaderLink to="/fav">Theater</HeaderLink>
        </h1>
        <MyFavMovie {...params} history={history} />
      </>
    )
  }

  render() {
    const {
      location,
      history,
      match: { params },
    } = this.props
    const { what } = params
    // there is only 2 pages: theater (default) or movie
    const isDefault = what !== "movie"

    return (
      <PageContainer>
        <Helmet>
          <title>Fav | ShowtimesTH</title>
        </Helmet>
        <Navbar location={location} />
        {isDefault && this.renderFavTheater()}
        {!isDefault && this.renderFavMovie(params, history)}
      </PageContainer>
    )
  }
}

export default FavPage
