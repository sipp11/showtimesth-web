import React, { Component } from "react"
import Navbar from "../component/Navbar"
import One from "../component/movie/One"
import { PageContainer } from "../lib/piece"

class MoviePage extends Component {
  render() {
    const { id } = this.props.match.params
    return (
      <PageContainer>
        <Navbar />
        {!id && <span>Should be a list and search, huh?</span>}
        {id && <One id={id} />}
      </PageContainer>
    )
  }
}

export default MoviePage
