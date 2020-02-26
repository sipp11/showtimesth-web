import React, { Fragment } from "react"
import { SearchOps } from "./Ops"
import Loading from "../Loading"
import GoogleAds from "../GoogleAds"
import ListItemBlank from "../ListItemBlank"
import { TheaterListItem } from "../theater/List"
import MovieListItem from "../movie/Item"

export const TheaterResult = props => (
  <>
    {props.theaters.map((ele, ind) => (
      <Fragment key={`tr-frgmt-${ind}`}>
        {ind % 10 === 4 && (
          <GoogleAds
            format="fluid"
            layoutKey="-hb-7+2h-1m-4u"
            slot="6589741428"
          />
        )}
        <TheaterListItem theater={ele} />
      </Fragment>
    ))}
  </>
)

export const MovieResult = props => (
  <>
    {props.movies.map((ele, ind) => (
      <Fragment key={`tr-frgmt-${ind}`}>
        {ind % 10 === 4 && (
          <GoogleAds
            format="fluid"
            layoutKey="-hb-7+2h-1m-4u"
            slot="6589741428"
          />
        )}
        <MovieListItem movie={ele} />
      </Fragment>
    ))}
  </>
)

const SearchResult = props => {
  let variables = {}

  if (!props.nearbySkip) {
    variables = {
      lat: props.lat,
      lon: props.lon
    }
  } else if (!props.theaterSkip) {
    variables = { pattern: props.query }
  }

  return (
    <SearchOps
      variables={variables}
      movieSkip={props.movieSkip}
      theaterSkip={props.theaterSkip}
      nearbySkip={props.nearbySkip}
    >
      {({ theaterSearch, nearbyTheaters }) => {
        let { loading, data } = theaterSearch.result
        if (loading) return <Loading />
        if (
          data &&
          ((data.movie_search && data.movie_search.length > 0) ||
            (data.theater_search && data.theater_search.length > 0))
        ) {
          return (
            <>
              <TheaterResult theaters={data.theater_search} />
              <MovieResult movies={data.movie_search} />
            </>
          )
        }
        const nearbyData = nearbyTheaters.result.data

        if (
          nearbyData &&
          nearbyData.nearby_theaters &&
          nearbyData.nearby_theaters.length > 0
        ) {
          return <TheaterResult theaters={nearbyData.nearby_theaters} />
        }

        return (
          <ListItemBlank
            message={
              props.theaterSkip === false ? "ไม่มีข้อมูล" : "ค้นหาโรงหนัง"
            }
          />
        )
      }}
    </SearchOps>
  )
}

export default SearchResult
