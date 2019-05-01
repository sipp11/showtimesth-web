import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import { Subscribe } from "unstated"
import fecha from "fecha"
import BasicContainer from "../../unstated/basic"
import { imgSrc } from "../../utils/posterImage"
import { getYear } from "../../utils/dt"

const THEATER = gql`
  query THEATER($id: Int!, $day: date) {
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

const Item = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
  display: block;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
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
  color: #6a6a6a;
`

const ScreenBox = styled.div`
  display: flex;
  border-bottom: 1px #ccc solid;

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
  border-left: 1px #ccc solid;
  font-family: Menlo, Monaco, "Courier New", monospace;

  @media screen and (max-width: 450px) {
    border-left: 2px #ccc solid;
  }
`

const Hero = styled.section`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem 0.8rem;
  background-color: #f5f5f5;
  color: rgba(54, 54, 54, 0.9);

  h1.title {
    color: rgba(54, 54, 54, 0.9);
    font-size: 1.7rem;
  }
  span.desc {
    font-size: 0.9rem;
  }
`

const Theater = props => (
  <Query
    query={THEATER}
    variables={{
      id: props.id,
      day: fecha.format(new Date(), "YYYY-MM-DD")
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>
      if (!data || !data.theater_theater) return <div>No data yet</div>

      const {
        english,
        thai,
        tel,
        location,
        showtimes,
        chain
      } = data.theater_theater[0]
      let m = {}
      showtimes.map(ele => {
        if (!m[ele.movie.id]) {
          m[ele.movie.id] = []
        }
        m[ele.movie.id].push(ele)
      })
      return (
        <>
          <nav
            class="breadcrumb has-bullet-separator is-centered"
            style={{ fontSize: "0.8rem", marginBottom: 0 }}
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
          </nav>
          <Hero>
            <h2 class="title">{thai}</h2>
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
          </Hero>

          {!showtimes && <p>ยังไม่มีข้อมูลรอบหนัง</p>}
          {Object.keys(m).map(key => (
            <Item>
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
                        <muted>({getYear(m[key][0].movie.release_date)})</muted>
                      </strong>
                      <br />
                      <small>{m[key][0].movie.duration} min</small>
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
                            <>
                              <br />
                              <FontAwesome name={"ticket"} /> {ele.screen}{" "}
                            </>
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
            </Item>
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
