import React, { Component } from "react"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import Navbar from "../component/Navbar"
import { PageContainer } from "../lib/piece"
import Result from "../component/search/Result"

const Input = styled.input`
  border-radius: 0;
  box-shadow: none;

  :focus {
    border-color: transparent;
  }
`

class SearchPage extends Component {
  state = {
    loading: false,
    query: ""
  }

  componentDidMount() {
    this.nameInput.focus()
  }

  toggleFavLoading = () => {
    this.setState({ loading: !this.state.loading })
  }

  handleInputChange = e => {
    this.setState({ query: e.target.value.trim() })
  }

  render() {
    const isLoadingCls = this.state.loading ? " is-loading" : ""

    return (
      <PageContainer>
        <Navbar />
        <div className={`control has-icons-left is-large ${isLoadingCls}`}>
          <Input
            ref={input => {
              this.nameInput = input
            }}
            onChange={this.handleInputChange.bind(this)}
            className="input is-large"
            type="text"
            placeholder="Search"
          />
          <span className="icon is-medium is-left">
            <FontAwesome name={"search"} />
          </span>
        </div>
        <Result
          query={this.state.query}
          movieSkip={true}
          theaterSkip={this.state.query.length === 0}
        />
      </PageContainer>
    )
  }
}

export default SearchPage
