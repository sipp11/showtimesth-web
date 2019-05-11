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

const SearchResult = props => (
  <SearchOps
    variables={{ pattern: props.query }}
    movieSkip={props.movieSkip}
    theaterSkip={props.theaterSkip}
  >
    {({ theaterSearch }) => {
      const { loading, data, error } = theaterSearch.result
      if (loading) return <Loading />
      if (!data || !data.theater_search || data.theater_search.length === 0)
        return (
          <ListItemBlank
            message={
              props.theaterSkip === false ? "ไม่มีข้อมูล" : "ค้นหาโรงหนัง"
            }
          />
        )
      return <TheaterResult theaters={data.theater_search} />
    }}
  </SearchOps>
)

export default SearchResult
