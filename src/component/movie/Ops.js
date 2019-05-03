import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { adopt } from "react-adopt"

const MOVIE_QUERY = gql`
  query MOVIE_QUERY($movieId: Int!, $userId: Int) {
    movie_movie(where: { id: { _eq: $movieId } }) {
      id
      title
      release_date
      duration
      tags
      videos(order_by: { source: desc }, limit: 2) {
        kind
        type
        url
        source
      }
      images(limit: 2, order_by: { order: desc }) {
        location
        source
        type
        url
      }
      details {
        language
        title
        director
        cast
        storyline
      }
      votes_aggregate {
        aggregate {
          avg {
            points
          }
          count
        }
      }
      votes(where: { user_id: { _eq: $userId } }) {
        id
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

const MOVIE_ADD_FAV = gql`
  mutation MOVIE_ADD_FAV(
    $movieId: Int!
    $star: bool
    $starredSince: date
    $watched: bool
    $watchedSince: date
  ) {
    insert_people_favmovie(
      objects: {
        movie_id: $movieId
        star: $star
        starred_since: $starredSince
        watched: $watched
        watched_since: $watchedSince
      }
      on_conflict: {
        constraint: people_favmovie_pkey
        update_columns: movie_id
      }
    ) {
      affected_rows
    }
  }
`

const addFav = ({ variables, render }) => (
  <Mutation mutation={MOVIE_ADD_FAV} variables={variables}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const MOVIE_STAR_UPDATE = gql`
  mutation MOVIE_STAR_UPDATE($movieId: Int!, $star: bool, $starredSince: date) {
    update_people_favmovie(
      where: { id: { _eq: $movieId } }
      _set: { star: $star, starred_since: $starredSince }
    ) {
      returning {
        star
        watched
        notify_update
      }
    }
  }
`

const starToggler = ({ variables, render }) => (
  <Mutation mutation={MOVIE_STAR_UPDATE} variables={variables}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const MOVIE_WATCH_UPDATE = gql`
  mutation MOVIE_WATCH_UPDATE(
    $movieId: Int!
    $watched: bool
    $watchedSince: date
  ) {
    update_people_favmovie(
      where: { id: { _eq: $movieId } }
      _set: { watched: $watched, watched_since: $watchedSince }
    ) {
      returning {
        star
        watched
        notify_update
      }
    }
  }
`

const watchToggler = ({ variables, render }) => (
  <Mutation mutation={MOVIE_WATCH_UPDATE} variables={variables}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

export const MovieOps = adopt({
  addFav,
  starToggler,
  watchToggler,
  movie: ({ variables, render }) => (
    <Query query={MOVIE_QUERY} variables={variables}>
      {result => render({ result })}
    </Query>
  )
})
