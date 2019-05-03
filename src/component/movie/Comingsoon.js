import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import fecha from "fecha"
import styled from "styled-components"
import PosterItem from "./PosterItem"
import Loading from "../Loading"
import { getWeek } from "../../lib/dt"

const COMINGSOON_MOVIES = gql`
  query COMINGSOON_MOVIES($day: date!, $offset: Int!) {
    comingsoon_movies(args: { day: $day }, limit: 30, offset: $offset) {
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

const WeeklyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  h1 {
    padding: 0 1rem;
    border-bottom: 1px solid #48525e;
    margin-bottom: 1rem;
  }
`

const PosterBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;

  margin-bottom: 2rem;
`

const weekWord = wk => {
  if (wk === 0) return "This week"
  if (wk === 1) return "Next week"
  return `Next ${wk} weeks`
}

const ComingSoon = () => (
  <Query
    query={COMINGSOON_MOVIES}
    variables={{ day: fecha.format(new Date(), "YYYY-MM-DD"), offset: 0 }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (!data || !data.comingsoon_movies) return <div>No data yet</div>

      const thisWeek = getWeek(new Date())
      let coll = {}
      data.comingsoon_movies.map(ele => {
        const wk = getWeek(ele.release_date)
        if (!coll[wk]) coll[wk] = []

        coll[wk].push(ele)
        return null
      })

      return (
        <WeeklyBox>
          {Object.keys(coll).map(wk => {
            return (
              <div key={`wk-${wk}`}>
                <h1>{weekWord(wk - thisWeek)}</h1>
                <PosterBox>
                  {coll[wk].map(ele => (
                    <PosterItem
                      key={`p-${ele.id}`}
                      {...ele}
                      show={true}
                      value={ele.release_date}
                    />
                  ))}
                </PosterBox>
              </div>
            )
          })}
        </WeeklyBox>
      )
    }}
  </Query>
)

export default ComingSoon
