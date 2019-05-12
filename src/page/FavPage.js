import React, { Component } from "react"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import Navbar from "../component/Navbar"
import FavTheater from "../component/theater/Fav"
import { PageContainer } from "../lib/piece"

class FavPage extends Component {
  componentDidMount() {
    ReactGA.pageview("/fav")
  }
  render() {
    return (
      <PageContainer>
        <Navbar />
        <h1>
          <FontAwesome name={"heart"} /> Theater
        </h1>
        <FavTheater />
      </PageContainer>
    )
  }
}

export default FavPage
