import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Subscribe } from "unstated"
import BasicContainer from "../../unstated/basic"
import { isJwtExpired } from "../../lib/jwt"
import Loading from "../Loading"
import ListItemBlank from "../ListItemBlank"
import { TheaterListItem } from "./List"

export const FAV_THEATERS = gql`
  query FAV_THEATERS($userId: Int) {
    people_favtheater(
      where: { user_id: { _eq: $userId } }
      order_by: { theater: { english: asc } }
    ) {
      theater {
        id
        slug
        thai
        english
        tel
      }
    }
  }
`

const FavTheater = props => (
  <Query query={FAV_THEATERS} variables={{ userId: props.basic.getUserId() }}>
    {({ client, loading, error, data }) => {
      if (loading) return <Loading />
      if (!isJwtExpired(error, client, props.basic, props.history))
        return <Loading />
      if (!data || data.people_favtheater.length === 0)
        return <ListItemBlank message="ยังไม่มีโรงหนังที่ Fav ไว้" />
      return (
        <>
          {data.people_favtheater.map(ele => (
            <TheaterListItem
              key={`tfav-${ele.theater.id}`}
              theater={ele.theater}
            />
          ))}
        </>
      )
    }}
  </Query>
)

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <FavTheater {...props} basic={basic} />}
    </Subscribe>
  )
}
