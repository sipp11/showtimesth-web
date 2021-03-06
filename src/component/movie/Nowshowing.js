import React from "react"
import { Helmet } from "react-helmet"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import fecha from "fecha"
import PosterItem, { CenterPosterBox as PosterBox } from "./PosterItem"
import Loading from "../Loading"
import { isJwtExpired } from "../../lib/jwt"
import ListItemBlank from "../ListItemBlank"

const NOWSHOWING_MOVIES = gql`
  query NOWSHOWING_MOVIES($day: date!) {
    nowshowing_movies(args: { day: $day }) {
      id
      slug
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

const helmet = (
  <Helmet>
    <title>Now showing | ShowtimesTH</title>
  </Helmet>
)

const NowShowingMovies = (props) => (
  <Query
    query={NOWSHOWING_MOVIES}
    variables={{ day: fecha.format(new Date(), "YYYY-MM-DD") }}
  >
    {({ client, loading, error, data }) => {
      if (loading) return <Loading />
      if (!isJwtExpired(error, client, props.basic, props.history))
        return <Loading />
      if (
        !data ||
        !data.nowshowing_movies ||
        data.nowshowing_movies.length === 0
      )
        return (
          <>
            {helmet}
            <ListItemBlank message="ไม่พบรอบฉายในวันนี้" />
          </>
        )
      return (
        <PosterBox>
          {helmet}
          {data.nowshowing_movies.map((ele) => (
            <PosterItem key={`p-${ele.id}`} {...ele} />
          ))}
        </PosterBox>
      )
    }}
  </Query>
)

export default NowShowingMovies
