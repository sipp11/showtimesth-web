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
        points
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

const MOVIE_ADD_VOTE = gql`
  mutation MOVIE_ADD_VOTE($movieId: Int!, $date: date, $points: smallint!) {
    insert_people_movievote(
      objects: {
        movie_id: $movieId
        points: $points
        date: $date
        session_id: ""
        ip: "0.0.0.0"
      }
      on_conflict: {
        constraint: people_movievote_user_id_movie_id_key
        update_columns: [points, date]
      }
    ) {
      affected_rows
    }
  }
`

const upsertVote = ({ variables, render }) => (
  <Mutation
    mutation={MOVIE_ADD_VOTE}
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

const MOVIE_RM_VOTE = gql`
  mutation MOVIE_RM_VOTE($movieId: Int!) {
    delete_people_movievote(where: { movie_id: { _eq: $movieId } }) {
      affected_rows
    }
  }
`

const rmVote = ({ variables, render }) => (
  <Mutation
    mutation={MOVIE_RM_VOTE}
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

export const TOP_FAV_MOVIES = gql`
  query TOP_FAV_MOVIES($userId: Int!, $offset: Int!) {
    items: people_movievote(
      where: { user_id: { _eq: $userId } }
      order_by: { points: desc, movie: { release_date: asc } }
      limit: 30
      offset: $offset
    ) {
      movie {
        id
        slug
        title
        release_date
        images(limit: 2, order_by: { order: desc }) {
          location
          source
          type
          url
        }
      }
      points
    }
    item_aggregate: people_movievote_aggregate(
      where: { user_id: { _eq: $userId } }
    ) {
      aggregate {
        count
      }
    }
  }
`

export const WATCHED_MOVIES = gql`
  query WATCHED_MOVIES($userId: Int!) {
    people_favmovie(
      where: { user_id: { _eq: $userId } }
      order_by: { watched_since: asc_nulls_last }
    ) {
      movie {
        id
        slug
        title
        release_date
        images(limit: 2, order_by: { order: desc }) {
          location
          source
          type
          url
        }
      }
      watched
      watched_since
      star
      starred_since
    }
  }
`

export const MovieOps = adopt({
  addFav,
  starToggler,
  watchToggler,
  upsertVote,
  rmVote,
  movie: ({ variables, render }) => (
    <Query query={MOVIE_QUERY} variables={variables}>
      {result => render({ result })}
    </Query>
  )
})
