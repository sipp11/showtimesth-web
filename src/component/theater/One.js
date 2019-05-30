import React, { Fragment } from "react"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import { Link } from "react-router-dom"
import { Subscribe } from "unstated"
import ReactGA from "react-ga"
import Loading from "../Loading"
import GoogleAds from "../GoogleAds"
import BasicContainer from "../../unstated/basic"
import { imgSrc } from "../../lib/posterImage"
import { getYear, getToday } from "../../lib/dt"
import { DimBox, BrightBox, Breadcrum, ifttt } from "../../lib/piece"
import { TheaterOps } from "./Ops"
import ListItemBlank from "../ListItemBlank"

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
const ScreenInfo = styled.div``
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

export const ScreenAndTime = props => (
  <ScreenBox>
    <ScreenInfo>
      {props.one.technology !== "2d" && (
        <> {props.one.technology.toUpperCase()} </>
      )}
      <FontAwesome name={"volume-up"} /> {props.one.audio}{" "}
      {props.one.caption && (
        <>
          <FontAwesome name={"font"} /> {props.one.caption}{" "}
        </>
      )}
      {props.one.screen && (
        <span className="muted">
          <br />
          <FontAwesome name={"ticket"} /> {props.one.screen}{" "}
        </span>
      )}
    </ScreenInfo>
    <ScreenTime>
      {props.one.time.split(",").map(i => (
        <span key={`mst-${props.ind}-${i}`}>{i}</span>
      ))}
    </ScreenTime>
  </ScreenBox>
)

export const MovieScreenAndTime = props => {
  const { one } = props
  return (
    <DimBox>
      <article className="media">
        <div className="media-left">
          <Link to={`/m/${one[0].movie.id}`}>
            <FigImage>
              <img
                alt="poster"
                src={imgSrc(one[0].movie.images)}
                width="35"
                height="70"
              />
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
            {one.map((ele, key) => (
              <ScreenAndTime
                one={ele}
                ind={key}
                key={`mst-${one[0].movie.id}-${key}`}
              />
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

  componentDidMount() {
    const {
      theater: { id, slug }
    } = this.props
    ReactGA.pageview(`/t/${id}-${slug}`)
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
              <Link to={`/list/${chain.code}`}>{chain.english}</Link>
            </li>
            <li className="is-active">&nbsp;&nbsp;&nbsp;{english}</li>
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
            {location && (
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
                ReactGA.event({
                  category: "Theater",
                  action: "Add fav",
                  value: id
                })
                return
              }
              await unFav.mutation({
                variables: {
                  id: userFav[0].id
                }
              })
              ReactGA.event({
                category: "Theater",
                action: "Remove fav",
                value: id
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

        {Object.keys(m).map((key, ind) => (
          <Fragment key={`msat-frgmt-${ind}`}>
            {ind % 10 === 2 && (
              <GoogleAds
                format="fluid"
                layoutKey="-gc+3r+68-9q-29"
                slot="8148389196"
              />
            )}
            <MovieScreenAndTime one={m[key]} />
          </Fragment>
        ))}
      </>
    )
  }
}

const extractTheaterId = id => {
  if (isNaN(id)) return id.split("-")[0]
  return id
}

const TheaterOne = props => (
  <TheaterOps
    variables={{
      theaterId: extractTheaterId(props.id),
      day: getToday(),
      userId: props.basic.getUserId() || -1
    }}
  >
    {({ addFav, unFav, theater: { result } }) => {
      const { loading, data } = result

      if (loading) return <Loading />
      if (!data || !data.theater_theater) return <ListItemBlank />
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
