import React, { Component } from "react"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import Navbar from "../component/Navbar"
import FavTheater from "../component/theater/Fav"

const PageContainer = styled.div`
  padding-bottom: 80px;
`

class FavPage extends Component {
  render() {
    return (
      <PageContainer>
        <Navbar />
        <h1 className="title">
          <FontAwesome name={"heart"} />
        </h1>
        <h1 className="subtitle is-1">Theater</h1>
        <FavTheater />
      </PageContainer>
    )
  }
}

export default FavPage
