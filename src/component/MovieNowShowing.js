import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import fecha from "fecha"

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
        url
      }
    }
  }
`

const NowShowingMovies = () => (
  <Query
    query={NOWSHOWING_MOVIES}
    variables={{ day: fecha.format(new Date(), "YYYY-MM-DD") }}
  >
    {({ client, loading, error, data }) => {
      if (loading) return <div>Loading...</div>
      if (!data || !data.nowshowing_movies) return <div>No data yet</div>
      return (
        <>
          {data.nowshowing_movies.map(ele => (
            <div>{ele.title}</div>
          ))}
        </>
      )
    }}
  </Query>
)

export default NowShowingMovies
