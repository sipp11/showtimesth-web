import React from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"
import { FAV_THEATER_AND_A_MOVIE } from "../theater/Ops"
import { ScreenAndTime } from "../theater/One"
import { getToday } from "../../lib/dt"
import { DimBox } from "../../lib/piece"
import { ReservationLink } from "../theater/Ops"

const FavTab = props => {
  const variables = {
    ...props,
    day: getToday()
  }
  if (props.userId === -1) {
    return <ListItemBlank message="ต้อง Login ก่อนนะถึงจะใช้ได้" />
  }

  return (
    <Query query={FAV_THEATER_AND_A_MOVIE} variables={variables}>
      {({ data, loading }) => {
        if (loading) return <Loading />
        if (!data || !data.people_favtheater) return <ListItemBlank />
        const { people_favtheater } = data
        return (
          <>
            {people_favtheater.map(({ theater }) => {
              return (
                <DimBox fontSize="0.85rem" key={`fav-${theater.id}`}>
                  <span className="is-pulled-right">
                    <ReservationLink
                      chain={theater.chain}
                      code={theater.code}
                    />
                  </span>
                  <Link to={`/t/${theater.id}`} className="title">
                    {theater.english}
                  </Link>
                  {theater.showtimes.length === 0 && (
                    <ListItemBlank
                      padding="5px"
                      message="ไม่มีรอบหนังเรื่องนี้"
                    />
                  )}
                  {theater.showtimes.length > 0 &&
                    theater.showtimes.map((ele, key) => (
                      <ScreenAndTime
                        one={ele}
                        ind={key}
                        key={`sat-${theater.id}-${key}`}
                      />
                    ))}
                </DimBox>
              )
            })}
          </>
        )
      }}
    </Query>
  )
}

export default FavTab
