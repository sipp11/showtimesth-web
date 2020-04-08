import React, { Component } from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import Navbar from "../component/Navbar"
import { PageContainer } from "../lib/piece"
import Result from "../component/search/Result"
import Controller from "../component/search/Controller"

const Input = styled.input`
  border-radius: 0;
  box-shadow: none;

  :focus {
    border-color: transparent;
  }
`

class SearchPage extends Component {
  watchID = null
  state = {
    loading: false,
    query: "",
    viewport: {},
  }

  recordLivePosition = (position) => {
    // don't update if it's too recent. Only 1 min at a time
    const { viewport } = this.state
    if (
      viewport.timestamp === undefined ||
      position.timestamp - viewport.timestamp > 60 * 1000
    ) {
      this.setState({
        viewport: {
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          timestamp: position.timestamp,
        },
      })
    }
  }

  componentDidMount() {
    this.nameInput.focus()
    ReactGA.pageview(`/search`)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.recordLivePosition(position)
      },
      (error) => {
        //console.log("nav.position", error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    )
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.recordLivePosition(position)
      },
      (error) => {
        //console.log("nav.position", error)
      }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  toggleFavLoading = () => {
    this.setState({ loading: !this.state.loading })
  }

  handleInputChange = (e) => {
    this.setState({ query: e.target.value.trim() })
    /* ReactGA.event({
      category: "Search",
      action: "Search with text",
      value: e.target.value.trim()
    }) */
  }

  activateNearBySearch = () => {
    this.nameInput.value = "#nearby"
    this.setState({ query: "#nearby" })
    ReactGA.event({
      category: "Search",
      action: "Search nearby",
    })
  }

  render() {
    const isLoadingCls = this.state.loading ? " is-loading" : ""
    const { query, viewport } = this.state
    const theaterSkip = query.length === 0 || query === "#nearby"
    const nearbySkip = query.length === 0 || query !== "#nearby"
    return (
      <PageContainer>
        <Helmet>
          <title>Search | ShowtimesTH</title>
        </Helmet>
        <Navbar location={this.props.location} />
        <div className={`control has-icons-left is-large ${isLoadingCls}`}>
          <Input
            ref={(input) => {
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
        <Controller
          acquirePosition={viewport.timestamp !== undefined}
          activateNearby={this.activateNearBySearch.bind(this)}
        />
        <Result
          query={this.state.query}
          movieSkip={true}
          theaterSkip={theaterSkip}
          nearbySkip={nearbySkip}
          {...viewport.coords}
        />
      </PageContainer>
    )
  }
}

export default SearchPage
