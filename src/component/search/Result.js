import React from "react"
import { SearchOps } from "./Ops"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"
import { TheaterListItem } from "../theater/Fav"

const TheaterResult = props => (
  <>
    {props.theaters.map(ele => (
      <TheaterListItem key={`tr-${ele.id}`} theater={ele} />
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
        if (data && data.theater_search && data.theater_search.length > 0) {
          return <TheaterResult theaters={data.theater_search} />
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
