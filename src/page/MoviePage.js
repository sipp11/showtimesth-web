import React, { Component } from "react"
import Navbar from "../component/Navbar"
import One from "../component/movie/One"
import { PageContainer } from "../lib/piece"

class MoviePage extends Component {
  render() {
    const {
      history,
      match: { params }
    } = this.props
    const { id } = params
    return (
      <PageContainer>
        <Navbar />
        {!id && <span>Should be a list and search, huh?</span>}
        {id && <One {...params} history={history} />}
      </PageContainer>
    )
  }
}

export default MoviePage
