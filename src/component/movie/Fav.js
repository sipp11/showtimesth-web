import React, { Fragment } from "react"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import { Subscribe } from "unstated"
import { NetworkStatus } from "apollo-client"
import BasicContainer from "../../unstated/basic"
import PosterItem, { LeftyPosterBox } from "./PosterItem"
import { FlexDimBox, Tab } from "../../lib/piece"
import { dateFmt } from "../../lib/dt"
import Loading from "../Loading"
import { WeeklyBox } from "./Comingsoon"
import { TOP_FAV_MOVIES, WATCHED_MOVIES } from "./Ops"
import { Query } from "react-apollo"

const YearlyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  h1 {
    padding: 0 1rem;
    border-bottom: 1px solid #48525e;
    margin-bottom: 1rem;
  }
`

const TopFavMovies = props => (
  <Query
    query={TOP_FAV_MOVIES}
    variables={{ userId: props.basic.getUserId(), offset: 0 }}
  >
    {({ client, loading, error, data, fetchMore, networkStatus }) => {
      if (loading) return <Loading />
      if (error || !data || !data.items || data.items.length === 0) {
        // most of the time items is empty, then we should logout.
        setTimeout(() => {
          props.basic.logout(client)
          props.history.push("/login")
        }, 500)
        return <Loading />
      }

      const { items, item_aggregate } = data
      const { count } = item_aggregate.aggregate
      const areMoreItems = items.length < count

      const loadingMoreItems = networkStatus === NetworkStatus.fetchMore
      const loadMoreItems = () => {
        fetchMore({
          variables: {
            offset: items.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }
            return Object.assign({}, previousResult, {
              // Append the new items results to the old one
              items: [...previousResult.items, ...fetchMoreResult.items]
            })
          }
        })
      }

      let ratings = []
      let coll = {}
      items.map(ele => {
        if (ratings.indexOf(ele.points) === -1) ratings.push(ele.points)
        if (coll[ele.points] === undefined) coll[ele.points] = []
        coll[ele.points].push(ele)
        return null
      })

      return (
        <WeeklyBox>
          {ratings.map(k => (
            <Fragment key={k}>
              <h1>
                {(k / 2).toFixed(1)} <FontAwesome name="heart" />
              </h1>
              <LeftyPosterBox>
                {coll[k].map((ele, key) => (
                  <PosterItem
                    key={`mvote-${key}`}
                    {...ele.movie}
                    value={
                      <div>
                        {(ele.points / 2).toFixed(1)}{" "}
                        <FontAwesome name="heart" />
                      </div>
                    }
                    show={true}
                  />
                ))}
              </LeftyPosterBox>
            </Fragment>
          ))}
          {areMoreItems && (
            <button
              className="button is-success is-small"
              onClick={() => loadMoreItems()}
              disabled={loadingMoreItems}
            >
              {loadingMoreItems ? "Loading..." : "Show More"}
            </button>
          )}
        </WeeklyBox>
      )
    }}
  </Query>
)

const WatchedMovies = props => (
  <Query query={WATCHED_MOVIES} variables={{ userId: props.basic.getUserId() }}>
    {({ client, loading, error, data }) => {
      if (loading) return <Loading />
      const alls = data.people_favmovie
      if (error || !data || !alls || alls.length === 0) {
        // most of the time people_favmovie is empty, then we should logout.
        setTimeout(() => {
          props.basic.logout(client)
          props.history.push("/login")
        }, 500)
        return <Loading />
      }
      let yrs = []
      let items = {}
      let noWatchedSince = []
      alls.map(i => {
        if (i.watched_since === null) {
          noWatchedSince.push(i)
        } else {
          const y = i.watched_since.substr(0, 4)
          if (!yrs.includes(y)) {
            yrs.push(y)
            items[y] = []
          }
          items[y].push(i)
        }
        return null
      })

      return (
        <YearlyBox>
          {yrs.map(yr => (
            <div key={`pbx-${yr}`}>
              <h1>{yr}</h1>
              <LeftyPosterBox>
                {items[yr].map((ele, key) => (
                  <PosterItem
                    key={`mvote-${yr}-${key}`}
                    {...ele.movie}
                    value={dateFmt(ele.watched_since)}
                    show={true}
                  />
                ))}
              </LeftyPosterBox>
            </div>
          ))}
        </YearlyBox>
      )
    }}
  </Query>
)

const MyFavMovie = props => {
  const { basic, history, tab: activeTab } = props
  const isWatchedTab = activeTab === "watched"
  return (
    <>
      {/*  Tabs  */}
      <FlexDimBox
        backgroundColor={"transparent"}
        marginBottom={0}
        fontSize="0.8rem"
        padding="0"
      >
        <Tab to={`/fav/movie/most-loved`} active={!isWatchedTab ? 1 : 0}>
          <FontAwesome name="heart" /> Most Loved
        </Tab>
        <Tab to={`/fav/movie/watched`} active={isWatchedTab ? 1 : 0}>
          <FontAwesome name="film" /> Watched
        </Tab>
      </FlexDimBox>
      {!isWatchedTab && <TopFavMovies basic={basic} history={history} />}
      {isWatchedTab && <WatchedMovies basic={basic} history={history} />}
    </>
  )
}

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <MyFavMovie {...props} basic={basic} />}
    </Subscribe>
  )
}
