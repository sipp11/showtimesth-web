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
      slug
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
    $star: Boolean
    $starredSince: timestamptz
    $watched: Boolean
    $watchedSince: timestamptz
  ) {
    insert_people_favmovie(
      objects: {
        movie_id: $movieId
        notify_update: false
        remind_first_week: false
        remind_last_chance: false
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
  <Mutation
    mutation={MOVIE_ADD_FAV}
    refetchQueries={[
      {
        query: MOVIE_QUERY,
        variables
      }
    ]}
  >
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const MOVIE_STAR_UPDATE = gql`
  mutation MOVIE_STAR_UPDATE(
    $id: Int!
    $star: Boolean
    $starredSince: timestamptz
  ) {
    update_people_favmovie(
      where: { id: { _eq: $id } }
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
  <Mutation
    mutation={MOVIE_STAR_UPDATE}
    refetchQueries={[
      {
        query: MOVIE_QUERY,
        variables
      }
    ]}
  >
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const MOVIE_WATCH_UPDATE = gql`
  mutation MOVIE_WATCH_UPDATE(
    $id: Int!
    $watched: Boolean
    $watchedSince: timestamptz
  ) {
    update_people_favmovie(
      where: { id: { _eq: $id } }
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
  <Mutation
    mutation={MOVIE_WATCH_UPDATE}
    refetchQueries={[
      {
        query: MOVIE_QUERY,
        variables
      }
    ]}
  >
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
