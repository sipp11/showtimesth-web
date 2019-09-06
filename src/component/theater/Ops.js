import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { adopt } from "react-adopt"
import { FAV_THEATERS } from "./Fav"
import ReactGA from "react-ga"
import styled from "styled-components"

export const FAV_THEATER_AND_A_MOVIE = gql`
  query FAV_THEATER_AND_A_MOVIE($userId: Int!, $movieId: Int!, $day: date) {
    people_favtheater(
      where: { user_id: { _eq: $userId } }
      order_by: { theater: { english: asc } }
    ) {
      theater {
        id
        slug
        code
        thai
        english
        point
        chain {
          code
        }
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

export const THEATERS_WITH_A_MOVIE = gql`
  query THEATERS_WITH_A_MOVIE(
    $offset: Int
    $limit: Int
    $movieId: Int!
    $day: date
  ) {
    theater_theater(
      where: {
        showtimes: {
          _and: { date: { _eq: $day }, movie_id: { _eq: $movieId } }
        }
      }
      order_by: { id: asc }
      offset: $offset
      limit: $limit
    ) {
      id
      slug
      code
      english
      thai
      chain {
        code
      }
      showtimes(
        where: { _and: { date: { _eq: $day }, movie_id: { _eq: $movieId } } }
        order_by: { audio: asc, screen: asc }
      ) {
        movie {
          id
          slug
        }
        id
        date
        audio
        caption
        screen
        time
        technology
      }
    }
  }
`

export const theatersWithAMovieTime = ({ variables, render }) => (
  <Query query={THEATERS_WITH_A_MOVIE} variables={variables}>
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
      code
      english
      thai
      point
      chain {
        code
      }
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
      code
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

const StyledOutboundLink = styled(ReactGA.OutboundLink)`
  margin: 0 0.3rem;
  font-weight: 600;
  font-size: 0.6rem;
  padding-bottom: 0;
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: 0;
  border-radius: 1px;
  background-color: #ffffffaa !important;

  :hover {
    background: #fff !important;
  }
`

export const ReservationLink = props => {
  const { chain, code } = props
  const reservableChains = ["sf", "major"]
  if (reservableChains.indexOf(chain.code) === -1) {
    return <></>
  }
  let urlTmpl = {
    major: `https://www.majorcineplex.com/booking2/search_showtime/cinema=`,
    sf: `https://www.sfcinemacity.com/showtime/cinema/`
  }
  const url = `${urlTmpl[chain.code]}${code}`
  return (
    <StyledOutboundLink
      eventLabel="reserve"
      to={url}
      target="_blank"
      className="button is-white"
    >
      RESERVE
    </StyledOutboundLink>
  )
}

export const TheaterOps = adopt({
  addFav,
  unFav,
  theater: ({ variables, render }) => (
    <Query query={THEATER_QUERY} variables={variables}>
      {result => render({ result })}
    </Query>
  )
})
