import React from "react"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import { Subscribe } from "unstated"
import BasicContainer from "../../unstated/basic"
import PosterItem, { CenterPosterBox, LeftyPosterBox } from "./PosterItem"
import { FlexDimBox, Tab } from "../../lib/piece"
import { dateFmt } from "../../lib/dt"
import Loading from "../Loading"
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
  <Query query={TOP_FAV_MOVIES} variables={{ userId: props.basic.getUserId() }}>
    {({ client, loading, error, data }) => {
      if (loading) return <Loading />
      if (
        error ||
        !data ||
        !data.people_movievote ||
        data.people_movievote.length === 0
      ) {
        // most of the time people_movievote is empty, then we should logout.
        setTimeout(() => {
          props.basic.logout(client)
          props.history.push("/login")
        }, 500)
        return <Loading />
      }
      return (
        <CenterPosterBox>
          {data.people_movievote.map((ele, key) => (
            <PosterItem
              key={`mvote-${key}`}
              {...ele.movie}
              value={
                <div>
                  {(ele.points / 2).toFixed(1)} <FontAwesome name="heart" />
                </div>
              }
              show={true}
            />
          ))}
        </CenterPosterBox>
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
