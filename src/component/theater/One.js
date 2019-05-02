import React from "react"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import { Subscribe } from "unstated"
import fecha from "fecha"
import Loading from "../Loading"
import BasicContainer from "../../unstated/basic"
import { imgSrc } from "../../lib/posterImage"
import { getYear } from "../../lib/dt"
import { DimBox, BrightBox, Breadcrum } from "../../lib/piece"

const THEATER_ADD_FAV = gql`
  mutation THEATER_ADD_FAV($tId: Int!, $userId: Int!) {
    insert_people_favtheater(
      objects: { theater_id: $tId, user_id: $userId, notify_update: false }
      on_conflict: {
        constraint: people_favtheater_pkey
        update_columns: theater_id
      }
    ) {
      affected_rows
    }
  }
`

const THEATER_UN_FAV = gql`
  mutation THEATER_UN_FAV($id: Int!) {
    delete_people_favtheater(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

const THEATER = gql`
  query THEATER($id: Int!, $day: date, $userId: Int) {
    people_favtheater(
      where: { _and: { user_id: { _eq: $userId }, theater_id: { _eq: $id } } }
    ) {
      id
      user_id
      theater_id
    }
    theater_theater(where: { id: { _eq: $id } }) {
      english
      thai
      tel
      location
      favs_aggregate {
        aggregate {
          count
        }
      }
      chain {
        code
        english
      }
      showtimes(
        where: { date: { _eq: $day } }
        order_by: { movie: { title: asc }, audio: asc, screen: asc }
      ) {
        movie {
          id
          title
          duration
          release_date
          language
          images(
            where: { type: { _eq: "Poster" } }
            order_by: { order: desc }
            limit: 1
          ) {
            location
            source
            type
            url
          }
        }
        audio
        caption
        screen
        time
        technology
      }
    }
  }
`

const FigImage = styled.figure`
  display: block;
  position: relative;
  width: 95px;
  height: 135px;

  img {
    height: 100%;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: block;
  }
`

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #cbd3dd;
`

const ScreenBox = styled.div`
  display: flex;
  border-bottom: 1px #1f2f42 solid;

  div {
    padding: 0.5rem;
  }

  @media screen and (max-width: 450px) {
    flex-direction: column;
    border-bottom: 0px;

    div {
      padding: 0.3rem 0.5rem;
    }
  }
`
const ScreenInfo = styled.div`
  width: 8rem;
`
const ScreenTime = styled.div`
  flex: 1;
  border-left: 1px #1f2f42 solid;
  font-family: Menlo, Monaco, "Courier New", monospace;

  @media screen and (max-width: 450px) {
    border-left: 2px #1f2f42 solid;
  }
`

const UnFav = props => (
  <Mutation
    mutation={THEATER_UN_FAV}
    refetchQueries={[
      {
        query: THEATER,
        variables: {
          id: props.tId,
          userId: props.userId,
          day: fecha.format(new Date(), "YYYY-MM-DD")
        }
      }
    ]}
  >
    {(unFavTheater, { data }) => (
      <span
        className={`tag ${props.isFav ? "is-danger" : "is-white"}`}
        onClick={() => {
          unFavTheater({ variables: { id: props.favData[0].id } })
        }}
      >
        <FontAwesome name="heart" />
        &nbsp;UnFav {props.favCount}
      </span>
    )}
  </Mutation>
)

const ToFav = props => (
  <Mutation
    mutation={THEATER_ADD_FAV}
    refetchQueries={[
      {
        query: THEATER,
        variables: {
          id: props.tId,
          userId: props.userId,
          day: fecha.format(new Date(), "YYYY-MM-DD")
        }
      }
    ]}
  >
    {(addFavTheater, { data }) => (
      <span
        className={`tag ${props.isFav ? "is-danger" : "is-white"}`}
        onClick={() => {
          addFavTheater({ variables: { tId: props.tId, userId: props.userId } })
        }}
      >
        <FontAwesome name="heart" />
        &nbsp;Fav {props.favCount}
      </span>
    )}
  </Mutation>
)

const FavController = props => (
  <>
    {!props.isFav && <ToFav {...props} />}
    {props.isFav && <UnFav {...props} />}
  </>
)

const Theater = props => (
  <Query
    query={THEATER}
    variables={{
      id: props.id,
      day: fecha.format(new Date(), "YYYY-MM-DD"),
      userId: props.basic.getUserId() || -1
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (!data || !data.theater_theater) return <div>No data yet</div>

      const {
        english,
        thai,
        tel,
        location,
        showtimes,
        chain,
        favs_aggregate: {
          aggregate: { count }
        }
      } = data.theater_theater[0]
      let m = {}
      showtimes.map(ele => {
        if (!m[ele.movie.id]) {
          m[ele.movie.id] = []
        }
        m[ele.movie.id].push(ele)
      })

      const isFav = data.people_favtheater.length > 0

      return (
        <>
          <Breadcrum
            className="breadcrumb has-bullet-separator is-centered"
            aria-label="breadcrumbs"
          >
            <ul>
              <li>
                <a href="#">{chain.english}</a>
              </li>
              <li class="is-active">
                <a href="#" aria-current="page">
                  {english}
                </a>
              </li>
            </ul>
          </Breadcrum>
          <BrightBox>
            <h1>{thai}</h1>
            <Desc>
              {tel && (
                <span>
                  <FontAwesome name="phone" /> {tel}
                </span>
              )}
              {tel && (
                <span>
                  <FontAwesome name="map-marker" /> {location}
                </span>
              )}
            </Desc>
            <FavController
              isFav={isFav}
              favCount={count}
              favData={data.people_favtheater}
              tId={props.id}
              userId={props.basic.getUserId()}
            />
          </BrightBox>

          {showtimes.length === 0 && (
            <DimBox center={true}>ยังไม่มีข้อมูลรอบหนัง</DimBox>
          )}

          {Object.keys(m).map(key => (
            <DimBox>
              <article className="media">
                <div className="media-left">
                  <FigImage>
                    <img
                      src={imgSrc(m[key][0].movie.images)}
                      width="35"
                      height="70"
                    />
                  </FigImage>
                </div>
                <div className="media-content">
                  <div className="content">
                    <div>
                      <strong>
                        {m[key][0].movie.title}{" "}
                        <span className="muted">
                          ({getYear(m[key][0].movie.release_date)})
                        </span>
                      </strong>
                      <br />
                      <small className="muted">
                        {m[key][0].movie.duration} min
                      </small>
                    </div>
                    {m[key].map(ele => (
                      <ScreenBox>
                        <ScreenInfo>
                          {ele.technology !== "2d" && (
                            <> {ele.technology.toUpperCase()} </>
                          )}
                          <FontAwesome name={"volume-up"} />{" "}
                          {ele.audio || ele.movie.language}{" "}
                          {ele.caption && (
                            <>
                              <FontAwesome name={"font"} /> {ele.caption}{" "}
                            </>
                          )}
                          {ele.screen && (
                            <muted>
                              <br />
                              <FontAwesome name={"ticket"} /> {ele.screen}{" "}
                            </muted>
                          )}
                        </ScreenInfo>
                        <ScreenTime>
                          {ele.time.split(",").map(i => (
                            <span>{i}</span>
                          ))}
                        </ScreenTime>
                      </ScreenBox>
                    ))}
                  </div>
                </div>
              </article>
            </DimBox>
          ))}
        </>
      )
    }}
  </Query>
)

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <Theater {...props} basic={basic} />}
    </Subscribe>
  )
}
