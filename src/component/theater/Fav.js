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

const FavTheater = props => (
  <Query query={FAV_MOVIES} variables={{ userId: props.basic.getUserId() }}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (!data || !data.people_favtheater) return <div>No data yet</div>
      return (
        <>
          {data.people_favtheater.map(ele => (
            <Link to={`/t/${ele.theater.id}`}>
              <ListItem>
                <article>
                  <div className="content">
                    <p>
                      <strong>{ele.theater.english}</strong>
                      <br />
                      <small>{ele.theater.thai}</small>
                    </p>
                  </div>
                  {/* <nav class="level is-mobile">
                  <div class="level-left">
                    <a class="level-item" aria-label="reply">
                      <span class="icon is-small">
                        <i class="fas fa-reply" aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                </nav> */}
                </article>
              </ListItem>
            </Link>
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
