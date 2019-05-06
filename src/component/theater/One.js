import React from "react"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import { Link } from "react-router-dom"
import { Subscribe } from "unstated"
import Loading from "../Loading"
import BasicContainer from "../../unstated/basic"
import { imgSrc } from "../../lib/posterImage"
import { getYear, getToday } from "../../lib/dt"
import { DimBox, BrightBox, Breadcrum, ifttt } from "../../lib/piece"
import { TheaterOps } from "./Ops"

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
  overflow: hidden;
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
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  border-left: 1px #1f2f42 solid;
  font-family: Menlo, Monaco, "Courier New", monospace;

  span {
    width: 4rem;
  }

  @media screen and (max-width: 450px) {
    border-left: 2px #1f2f42 solid;
  }
`

const Button = styled.button`
  margin: 0 0.3rem;
  font-weight: 600;
  padding-bottom: 0;
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: 0;
`

const MovieScreenAndTime = props => {
  const { one } = props
  return (
    <DimBox>
      <article className="media">
        <div className="media-left">
          <Link to={`/m/${one[0].movie.id}`}>
            <FigImage>
              <img src={imgSrc(one[0].movie.images)} width="35" height="70" />
            </FigImage>
          </Link>
        </div>
        <div className="media-content">
          <div className="content">
            <div>
              <strong>
                {one[0].movie.title}{" "}
                <span className="muted">
                  ({getYear(one[0].movie.release_date)})
                </span>
              </strong>
              <br />
              <small className="muted">{one[0].movie.duration} min</small>
            </div>
            {one.map(ele => (
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
                    <span className="muted">
                      <br />
                      <FontAwesome name={"ticket"} /> {ele.screen}{" "}
                    </span>
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
  )
}

class Detail extends React.Component {
  state = {
    favLoading: false
  }

  toggleFavLoading = () => {
    this.setState({ favLoading: !this.state.favLoading })
  }

  render() {
    const { userId, theater } = this.props
    const {
      id,
      chain,
      english,
      thai,
      tel,
      location,
      showtimes,
      favs,
      favs_aggregate: {
        aggregate: { count }
      }
    } = theater
    let m = {}
    showtimes.map(ele => {
      if (!m[ele.movie.id]) {
        m[ele.movie.id] = []
      }
      m[ele.movie.id].push(ele)
      return null
    })

    const favCount = count
    const userFav = favs.filter(f => f.user_id === userId)

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
            <li className="is-active">
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

          <Button
            className={`button is-small ${
              userFav.length > 0 ? "is-danger" : ""
            } ${this.state.favLoading ? "is-loading" : ""}`}
            disabled={userId === -1 || this.state.favLoading}
            onClick={async () => {
              this.toggleFavLoading()
              const { addFav, unFav } = this.props.mutation
              let vars
              if (userFav.length === 0) {
                vars = {
                  theaterId: id
                }
                await addFav.mutation({
                  variables: vars
                })
                this.toggleFavLoading()
                return
              }
              await unFav.mutation({
                variables: {
                  id: userFav[0].id
                }
              })
              this.toggleFavLoading()
            }}
          >
            {ifttt(userFav.length === 0, "Fav", "Faved")}{" "}
            {favCount > 0 ? `${favCount}` : ""}
          </Button>
        </BrightBox>

        {showtimes.length === 0 && (
          <DimBox center={true}>ยังไม่มีข้อมูลรอบหนัง</DimBox>
        )}

        {Object.keys(m).map(key => (
          <MovieScreenAndTime key={`mst-${key}`} one={m[key]} />
        ))}
      </>
    )
  }
}

const TheaterOne = props => (
  <TheaterOps
    variables={{
      theaterId: props.id,
      day: getToday(),
      userId: props.basic.getUserId() || -1
    }}
  >
    {({ addFav, unFav, theater: { result } }) => {
      const { loading, data, error } = result

      if (loading) return <Loading />
      if (!data || !data.theater_theater) return <div>No data yet</div>
      const theater = data.theater_theater[0]
      return (
        <Detail
          theater={theater}
          userId={props.basic.getUserId()}
          mutation={{ addFav, unFav }}
        />
      )
    }}
  </TheaterOps>
)

export default props => (
  <Subscribe to={[BasicContainer]}>
    {basic => <TheaterOne {...props} basic={basic} />}
  </Subscribe>
)
