import React, { Component } from "react"
import Navbar from "../component/Navbar"
import One from "../component/movie/One"
import { PageContainer } from "../lib/piece"

class MoviePage extends Component {
  render() {
    const { params } = this.props.match
    const { id } = params
    return (
      <PageContainer>
        <Navbar />
        {!id && <span>Should be a list and search, huh?</span>}
        {id && <One {...params} />}
      </PageContainer>
    )
  }
}

export default MoviePage
