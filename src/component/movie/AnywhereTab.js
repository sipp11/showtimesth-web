import React, { Component } from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"
import ReactGA from "react-ga"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"
import { THEATERS_WITH_A_MOVIE } from "../theater/Ops"
import { ScreenAndTime } from "../theater/One"
import { getToday } from "../../lib/dt"
import { DimBox } from "../../lib/piece"
import { ReservationLink } from "../theater/Ops"

class AnywhereTab extends Component {
  today = getToday()
  state = {
    items: [],
    bottomReached: false,
    lastOffset: -1
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight
  }

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling)
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling)
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("anywhere-box")
    if (this.isBottom(wrappedElement)) {
      this.setState({ bottomReached: true })
      document.removeEventListener("scroll", this.trackScrolling)
    }
  }

  resetTrackingScrolling = (fetchMore, offset) => {
    const { lastOffset } = this.state

    setTimeout(() => {
      ReactGA.event({
        category: "Movie",
        action: "Load more",
        label: "anywhere"
      })
      this.setState({ bottomReached: false, lastOffset: offset })
      if (lastOffset === offset) return

      fetchMore({
        variables: {
          day: this.today,
          offset: offset
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return Object.assign({}, prev, {
            theater_theater: [
              ...prev.theater_theater,
              ...fetchMoreResult.theater_theater
            ]
          })
        }
      })
      // delay again not to track scrolling until new one arrived
      setTimeout(() => {
        if (lastOffset !== offset)
          document.addEventListener("scroll", this.trackScrolling)
      }, 1500)
    }, 100)
  }

  render() {
    const variables = {
      ...this.props,
      day: this.today,
      offset: 0
    }
    const { bottomReached } = this.state

    return (
      <div id="anywhere-box">
        <Query query={THEATERS_WITH_A_MOVIE} variables={variables}>
          {({ data, loading, fetchMore }) => {
            if (loading) return <Loading />
            if (!data || !data.theater_theater) return <ListItemBlank />
            const { theater_theater } = data

            if (bottomReached) {
              this.resetTrackingScrolling(fetchMore, theater_theater.length)
            }

            return (
              <>
                {theater_theater.map((theater, ind) => {
                  return (
                    <DimBox fontSize="0.85rem" key={`anyw-${ind}`}>
                      <span className="is-pulled-right">
                        <ReservationLink
                          chain={theater.chain}
                          code={theater.code}
                        />
                      </span>
                      <Link to={`/t/${theater.id}`} className="title">
                        {theater.english}
                      </Link>
                      {theater.showtimes.length === 0 && (
                        <ListItemBlank
                          padding="5px"
                          message="ไม่มีรอบหนังเรื่องนี้"
                        />
                      )}
                      {theater.showtimes.length > 0 &&
                        theater.showtimes.map((ele, key) => (
                          <ScreenAndTime
                            one={ele}
                            ind={key}
                            key={`anyw-sat-${ind}-${key}`}
                          />
                        ))}
                    </DimBox>
                  )
                })}
                {(loading || bottomReached) && <Loading />}
              </>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default AnywhereTab
