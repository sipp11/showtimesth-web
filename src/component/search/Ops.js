import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { adopt } from "react-adopt"

const THEATER_SEARCH = gql`
  query THEATER_SEARCH($pattern: String!, $offset: Int) {
    theater_search(args: { _pattern: $pattern }, offset: $offset) {
      chain {
        code
        english
        thai
      }
      id
      slug
      english
      thai
      point
    }
  }
`

export const theaterSearch = ({ variables, theaterSkip, render }) => (
  <Query query={THEATER_SEARCH} variables={variables} skip={theaterSkip}>
    {result => render({ result })}
  </Query>
)

const NEARBY_THEATERS = gql`
  query NEARBY_THEATERS($lat: float8!, $lon: float8!, $offset: Int) {
    nearby_theaters(args: {lat: $lat, lon: $lon}, offset: $offset) {
      chain {
        code
        english
        thai
      }
      id
      slug
      english
      thai
      point
    }
  }
`

export const nearbyTheaters = ({ variables, nearbySkip, render }) => (
  <Query query={NEARBY_THEATERS} variables={variables} skip={nearbySkip}>
    {result => render({ result })}
  </Query>
)

const MOVIE_SEARCH = gql`
  query MOVIE_SEARCH($pattern: String!, $offset: Int) {
    movie_search(args: { _pattern: $pattern }, offset: $offset) {
      id
      title
      release_date
      tags
      votes_aggregate {
        aggregate {
          avg {
            points
          }
          count
        }
      }
      favs {
        id
        watched
        star
        user_id
      }
    }
  }
`

export const movieSearch = ({ variables, movieSkip, render }) => (
  <Query query={MOVIE_SEARCH} variables={variables} skip={movieSkip}>
    {result => render({ result })}
  </Query>
)

export const SearchOps = adopt({
  theaterSearch,
  movieSearch,
  nearbyTheaters
})
