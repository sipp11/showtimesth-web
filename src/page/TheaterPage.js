import React, { Component } from "react"
import styled from "styled-components"
import Navbar from "../component/Navbar"
import One from "../component/theater/One"

const PageContainer = styled.div`
  padding-bottom: 80px;
`

class TheaterPage extends Component {
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

export default TheaterPage
