import React from "react"
import { Helmet } from "react-helmet"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import fecha from "fecha"
import styled from "styled-components"
import ReactGA from "react-ga"
import PosterItem, { LeftyPosterBox as PosterBox } from "./PosterItem"
import { getWeek } from "../../lib/dt"
import { isJwtExpired } from "../../lib/jwt"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"

const COMINGSOON_MOVIES = gql`
  query COMINGSOON_MOVIES($day: date!, $offset: Int!) {
    comingsoon_movies(args: { day: $day }, limit: 30, offset: $offset) {
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

export const WeeklyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  h1 {
    padding: 0 1rem;
    border-bottom: 1px solid #48525e;
    margin-bottom: 1rem;
  }
`

const weekWord = (wk) => {
  if (wk > 52) return "Next year"
  if (wk === 0) return "This week"
  if (wk === 1) return "Next week"
  return `Next ${wk} weeks`
}

class ComingSoon extends React.Component {
  now = new Date()
  today = fecha.format(this.now, "YYYY-MM-DD")
  state = {
    items: [],
    bottomReached: false,
    lastOffset: -1,
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight
  }

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling)
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling)
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("weekly-box")
    if (this.isBottom(wrappedElement)) {
      this.setState({ bottomReached: true })
      document.removeEventListener("scroll", this.trackScrolling)
    }
  }

  resetTrackingScrolling = (fetchMore, offset) => {
    const { lastOffset } = this.state
    ReactGA.event({
      category: "Movie",
      action: "Load more",
      label: "comingsoon",
    })
    setTimeout(() => {
      this.setState({ bottomReached: false, lastOffset: offset })
      if (lastOffset === offset) return

      fetchMore({
        variables: {
          day: this.today,
          offset: offset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return Object.assign({}, prev, {
            comingsoon_movies: [
              ...prev.comingsoon_movies,
              ...fetchMoreResult.comingsoon_movies,
            ],
          })
        },
      })
      // delay again not to track scrolling until new one arrived
      setTimeout(() => {
        if (lastOffset !== offset)
          document.addEventListener("scroll", this.trackScrolling)
      }, 1500)
    }, 100)
  }

  render() {
    const { props } = this
    const { bottomReached } = this.state
    return (
      <Query
        query={COMINGSOON_MOVIES}
        variables={{
          day: this.today,
          offset: 0,
        }}
      >
        {({ client, loading, error, data, fetchMore }) => {
          if (loading) return <Loading />
          if (!isJwtExpired(error, client, props.basic, props.history))
            return <Loading />
          if (!data || !data.comingsoon_movies)
            return <ListItemBlank message="No data yet" />

          const { comingsoon_movies } = data
          if (bottomReached) {
            this.resetTrackingScrolling(fetchMore, comingsoon_movies.length)
          }

          // process movies into weekly
          const thisWeek = getWeek(this.now)
          let coll = {}
          comingsoon_movies.map((ele) => {
            const wk = getWeek(ele.release_date)
            let diffWk
            if (+fecha.format(this.now, "MM") > 11) {
              // add what's left off this year to next year
              diffWk = 52 - (thisWeek % 100) + (wk % 100)
            } else {
              diffWk = wk - thisWeek
            }
            const key = diffWk < 52 ? diffWk : 99
            if (!coll[key]) coll[key] = { label: weekWord(diffWk), items: [] }
            coll[key].items.push(ele)
            return null
          })

          return (
            <WeeklyBox id="weekly-box">
              <Helmet>
                <title>Coming soon | ShowtimesTH</title>
              </Helmet>
              {Object.keys(coll).map((wk) => {
                return (
                  <div key={`wk-${wk}`}>
                    <h1>{coll[wk].label}</h1>
                    <PosterBox>
                      {coll[wk].items.map((ele) => (
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
              {loading && <Loading />}
            </WeeklyBox>
          )
        }}
      </Query>
    )
  }
}

export default ComingSoon
