import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { adopt } from "react-adopt"
import { FAV_THEATERS } from "./Fav"

export const FAV_THEATER_AND_A_MOVIE = gql`
  query FAV_THEATER_AND_A_MOVIE($userId: Int!, $movieId: Int!, $day: date) {
    people_favtheater(
      where: { user_id: { _eq: $userId } }
      order_by: { theater: { english: asc } }
    ) {
      theater {
        id
        slug
        thai
        english
        point
        showtimes(
          where: { date: { _eq: $day }, movie_id: { _eq: $movieId } }
          order_by: { audio: asc, screen: asc }
        ) {
          audio
          caption
          screen
          time
          technology
        }
      }
    }
  }
`

export const favTheaterAndAMovieTime = ({ variables, render }) => (
  <Query query={FAV_THEATER_AND_A_MOVIE} variables={variables}>
    {result => render({ result })}
  </Query>
)

export const NEARBY_THEATERS_AND_A_MOVIE = gql`
  query NEARBY_THEATERS_AND_A_MOVIE(
    $lat: float8!
    $lon: float8!
    $offset: Int
    $limit: Int
    $movieId: Int!
    $day: date
  ) {
    nearby_theaters(
      args: { lat: $lat, lon: $lon }
      offset: $offset
      limit: $limit
    ) {
      id
      slug
      english
      thai
      point
      showtimes(
        where: { date: { _eq: $day }, movie_id: { _eq: $movieId } }
        order_by: { audio: asc, screen: asc }
      ) {
        audio
        caption
        screen
        time
        technology
      }
    }
  }
`

export const nearbyTheatersAndAMovieTime = ({ variables, render }) => (
  <Query query={NEARBY_THEATERS_AND_A_MOVIE} variables={variables}>
    {result => render({ result })}
  </Query>
)

const THEATER_QUERY = gql`
  query THEATER_QUERY($theaterId: Int!, $day: date, $userId: Int) {
    theater_theater(where: { id: { _eq: $theaterId } }) {
      id
      slug
      english
      thai
      tel
      location
      favs_aggregate {
        aggregate {
          count
        }
      }
      favs {
        id
        user_id
      }
      chain {
        code
        english
      }
      showtimes(
        where: { date: { _eq: $day } }
        order_by: { movie: { title: asc }, audio: asc, screen: asc }
      ) {
        movie {
          id
          title
          duration
          release_date
          language
          images(
            where: { type: { _eq: "Poster" } }
            order_by: { order: desc }
            limit: 1
          ) {
            location
            source
            type
            url
          }
        }
        audio
        caption
        screen
        time
        technology
      }
    }
  }
`

const THEATER_ADD_FAV = gql`
  mutation THEATER_ADD_FAV($theaterId: Int!) {
    insert_people_favtheater(
      objects: { theater_id: $theaterId }
      on_conflict: {
        constraint: people_favtheater_pkey
        update_columns: theater_id
      }
    ) {
      affected_rows
    }
  }
`

const addFav = ({ variables, render }) => (
  <Mutation
    mutation={THEATER_ADD_FAV}
    refetchQueries={[
      {
        query: THEATER_QUERY,
        variables
      },
      {
        query: FAV_THEATERS,
        variables: {
          userId: variables.userId
        }
      }
    ]}
  >
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const THEATER_UN_FAV = gql`
  mutation THEATER_UN_FAV($id: Int!) {
    delete_people_favtheater(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

const unFav = ({ variables, render }) => (
  <Mutation
    mutation={THEATER_UN_FAV}
    refetchQueries={[
      {
        query: THEATER_QUERY,
        variables
      },
      {
        query: FAV_THEATERS,
        variables: {
          userId: variables.userId
        }
      }
    ]}
  >
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

export const TheaterOps = adopt({
  addFav,
  unFav,
  theater: ({ variables, render }) => (
    <Query query={THEATER_QUERY} variables={variables}>
      {result => render({ result })}
    </Query>
  )
})
