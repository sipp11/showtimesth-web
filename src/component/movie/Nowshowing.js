import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import fecha from "fecha"
import styled from "styled-components"
import PosterItem from "./PosterItem"
import Loading from '../Loading'

const NOWSHOWING_MOVIES = gql`
  query NOWSHOWING_MOVIES($day: date!) {
    nowshowing_movies(args: { day: $day }) {
      id
      title
      release_date
      language
      images(limit: 2, order_by: { order: desc }) {
        location
        source
        type
        url
      }
    }
  }
`

const PosterBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`

const NowShowingMovies = () => (
  <Query
    query={NOWSHOWING_MOVIES}
    variables={{ day: fecha.format(new Date(), "YYYY-MM-DD") }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (!data || !data.nowshowing_movies) return <div>No data yet</div>
      return (
        <PosterBox>
          {data.nowshowing_movies.map(ele => (
            <PosterItem {...ele} />
          ))}
        </PosterBox>
      )
    }}
  </Query>
)

export default NowShowingMovies