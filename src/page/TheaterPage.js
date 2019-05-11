import React, { Component } from "react"
import Navbar from "../component/Navbar"
import One from "../component/theater/One"
import { PageContainer } from "../lib/piece"

class TheaterPage extends Component {
  render() {
    const { id } = this.props.match.params
    return (
      <PageContainer>
        <Navbar />
        {id === "search" && <span>Search?</span>}
        {!id && <span>Should be a list and search, huh?</span>}
        {id && <One id={id} />}
      </PageContainer>
    )
  }
}

export default TheaterPage
