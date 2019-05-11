import React from "react"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Subscribe } from "unstated"
import BasicContainer from "../../unstated/basic"
import { ListItem } from "../../lib/piece"
import Loading from "../Loading"

const FAV_MOVIES = gql`
  query FAV_MOVIES($userId: Int) {
    people_favtheater(
      where: { user_id: { _eq: $userId } }
      order_by: { theater: { english: asc } }
    ) {
      theater {
        id
        thai
        english
        slug
        tel
      }
    }
  }
`

export const TheaterListItem = props => (
  <Link to={`/t/${props.theater.id}`}>
    <ListItem>
      <article>
        <div className="content">
          <p>
            <strong>{props.theater.english}</strong>
            <br />
            <small>{props.theater.thai}</small>
          </p>
        </div>
      </article>
    </ListItem>
  </Link>
)

const FavTheater = props => (
  <Query query={FAV_MOVIES} variables={{ userId: props.basic.getUserId() }}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (!data || !data.people_favtheater) return <div>No data yet</div>
      return (
        <>
          {data.people_favtheater.map(ele => (
            <TheaterListItem theater={ele.theater} />
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
