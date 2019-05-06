import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { adopt } from "react-adopt"

const THEATER_QUERY = gql`
  query THEATER_QUERY($theaterId: Int!, $day: date, $userId: Int) {
    theater_theater(where: { id: { _eq: $theaterId } }) {
      id
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

const THEATER_SEARCH = gql`
  query THEATER_SEARCH($pattern: String!, $offset: Int!) {
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
      favs_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

const theaterSearch = ({ variables, render }) => (
  <Query query={THEATER_SEARCH} variables={variables}>
    {result => render({ result })}
  </Query>
)

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
      }
    ]}
  >
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

export const TheaterOps = adopt({
  addFav,
  unFav,
  theaterSearch,
  theater: ({ variables, render }) => (
    <Query query={THEATER_QUERY} variables={variables}>
      {result => render({ result })}
    </Query>
  )
})
