import React from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"
import { NEARBY_THEATERS_AND_A_MOVIE } from "../theater/Ops"
import { ScreenAndTime } from "../theater/One"
import { getToday } from "../../lib/dt"
import { DimBox } from "../../lib/piece"
import { ReservationLink } from "../theater/Ops"

class NearbyTab extends React.Component {
  watchID = null
  state = {
    viewport: {}
  }

  recordLivePosition = position => {
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
            lon: position.coords.longitude
          },
          timestamp: position.timestamp
        }
      })
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.recordLivePosition(position)
      },
      error => console.log("nav.position", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    )
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.recordLivePosition(position)
      },
      error => console.log("nav.position", error)
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render() {
    const variables = {
      ...this.state.viewport.coords,
      movieId: this.props.movieId,
      day: getToday(),
      limit: 5
    }
    return (
      <Query
        query={NEARBY_THEATERS_AND_A_MOVIE}
        variables={variables}
        skip={this.state.viewport.timestamp === undefined}
      >
        {({ data, loading }) => {
          if (loading) return <Loading />
          if (!data || !data.nearby_theaters) return <ListItemBlank />
          const { nearby_theaters } = data
          return (
            <>
              {nearby_theaters.map(theater => {
                return (
                  <DimBox fontSize="0.85rem" key={`fav-${theater.id}`}>
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
                          key={`sat-${theater.id}-${key}`}
                        />
                      ))}
                  </DimBox>
                )
              })}
            </>
          )
        }}
      </Query>
    )
  }
}

export default NearbyTab
