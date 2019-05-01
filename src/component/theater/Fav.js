import React from "react"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import { Subscribe } from "unstated"
import BasicContainer from "../../unstated/basic"

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

const Item = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
  display: block;
  padding: 0.75rem;
  /* margin-bottom: 0.5rem; */

  :hover {
    @keyframes pulse-colors {
      from {
        background: #ffffff;
      }
      to {
        background: #fd6390;
      }
    }

    animation: pulse-colors 1s infinite alternate linear;
  }
`

const FavTheater = props => (
  <Query query={FAV_MOVIES} variables={{ userId: props.basic.getUserId() }}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>
      if (!data || !data.people_favtheater) return <div>No data yet</div>
      return (
        <>
          {data.people_favtheater.map(ele => (
            <Link to={`/t/${ele.theater.id}`}>
              <Item>
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
              </Item>
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
