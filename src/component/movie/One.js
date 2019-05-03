import React from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import FontAwesome from "react-fontawesome"
import BasicContainer from "../../unstated/basic"
import Loading from "../Loading"
import { BrightBox, DimBox } from "../../lib/piece"
import { getYear } from "../../lib/dt"
import PosterItem from "./PosterItem"
import { MovieOps } from "./Ops"

const FlexBrightBox = styled(props => <BrightBox {...props} />)`
  display: flex;
  align-items: flex-end;
  min-height: 170px;

  img {
    position: relative;
    bottom: 0;
  }

  div.poster {
    width: 120px;
    position: relative;
    display: block;

    a {
      position: absolute;
      bottom: -55px;
    }
  }
`

const FlexDimBox = styled(props => <DimBox {...props} />)`
  display: flex;
  align-items: flex-start;
  h1 {
    padding: 0 0.5rem;
    font-size: 1.8rem;
    flex: 1;
  }

  span.video {
    display: inline-block;

    a > span.fa {
      vertical-align: middle;
      font-size: 40px;
    }
    a > span {
      padding-left: 5px;
    }
  }
  @media screen and (max-width: 450px) {
    h1 {
      padding: 0;
      font-size: 1.1rem;
    }
  }
`

const DetailDimBox = styled(props => <DimBox {...props} />)`
  div.video {
    display: inline-block;
    margin: 0 10px 10px 0;

    a {
      color: #e3e3e3;
    }
    a > span.fa {
      vertical-align: middle;
      font-size: 40px;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 10px;
      background: white;
      margin-right: 5px;
      color: red;
    }
  }
`

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.9rem;
  color: #cbd3dd;
`

const ButtonContainer = styled.span`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 0.5rem;

  button {
    margin: 0 0.3rem;
    font-weight: 600;
    padding-bottom: 0;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: 0;
  }
`

const Detail = props => {
  const {
    id,
    details,
    videos,
    votes_aggregate: { aggregate },
    votes,
    favs
  } = props.movie
  let selDetail = {}
  if (details.filter(d => d.language === "th").length > 0) {
    selDetail = details.filter(d => d.language === "th")[0]
  } else if (details.length > 0) {
    selDetail = details[0]
  }
  const likeCount = favs.filter(f => f.star).length
  const watchCount = favs.filter(f => f.watched).length
  const { userId } = props
  return (
    <>
      <FlexBrightBox marginBottom={0}>
        <div className="poster">
          <PosterItem {...props.movie} />
        </div>
      </FlexBrightBox>
      <FlexDimBox marginBottom={0}>
        <div style={{ width: "110px" }} />
        <h1>
          {props.movie.title}
          <span className="muted"> ({getYear(props.movie.release_date)})</span>
        </h1>
      </FlexDimBox>
      <DetailDimBox>
        <Desc>
          <ButtonContainer>
            <button
              className="button is-small"
              disabled={userId === -1}
              onClick={async () => {
                const { addFav, starToggler } = props.mutation
                const userFav = favs.filter(f => f.user_id === userId)
                let vars
                if (userFav.length === 0) {
                  vars = {
                    movieId: id,
                    star: true,
                    starredSince: new Date().toISOString(),
                    watched: false,
                    watchedSince: null
                  }
                  addFav.mutation({
                    variables: vars
                  })
                  return
                }
                const userLike =
                  userFav.length > 0 && userFav.filter(f => f.star).length > 0

                await starToggler.mutation({
                  variables: {
                    movieId: id,
                    star: !userLike,
                    starredSince: userLike ? null : new Date().toISOString()
                  }
                })

                if (!userLike) {
                  console.log("LIKE")
                  // unFavTheater({ variables: { id: props.favData[0].id } })
                } else {
                  console.log("UNLIKE")
                }
              }}
            >
              Like {likeCount > 0 ? `${likeCount}` : ""}
            </button>
            <button
              className="button is-small is-danger"
              disabled={userId === -1}
              onClick={() => {
                const userWatch = favs.filter(
                  f => f.watched && f.user_id === userId
                ).length
                if (userWatch === 0) {
                  console.log("WATCHED")
                } else {
                  console.log("UNWATCHED")
                }
              }}
            >
              Watch {watchCount > 0 ? `${watchCount}` : ""}
            </button>
          </ButtonContainer>
          <span>
            {videos.map(v => (
              <div key={`v-${v.url}-${v.source}`} className="video">
                <a href={`https://youtu.be/${v.url}`}>
                  <FontAwesome name="youtube-play" />
                  <span>
                    {v.kind} {v.source}
                  </span>
                </a>
              </div>
            ))}
          </span>
          {aggregate.count > 0 && (
            <span>
              <FontAwesome name="star" /> {aggregate.avg.points || "0"}{" "}
              <small className="muted">({aggregate.count} votes)</small>
            </span>
          )}
          <span>
            <em>Release date</em>: {props.movie.release_date}
          </span>
          {selDetail.language !== undefined && (
            <>
              <span>
                <em>Director</em>: <br />
                &nbsp;&nbsp;&nbsp;{selDetail.director || "-"}
              </span>
              <span>
                <em>Casts</em>: <br />
                &nbsp;&nbsp;&nbsp;{selDetail.cast || "-"}
              </span>
              <span>
                <em>Storyline</em>: <br />
                &nbsp;&nbsp;&nbsp;{selDetail.storyline || "-"}
              </span>
            </>
          )}
        </Desc>
      </DetailDimBox>
    </>
  )
}

const MovieOne = props => (
  <MovieOps
    variables={{ movieId: props.id, userId: props.basic.getUserId() || -1 }}
  >
    {({ addFav, starToggler, watchToggler, movie: { result } }) => {
      const { loading, data, error } = result

      if (loading) return <Loading />
      if (!data || !data.movie_movie) return <div>No data yet</div>
      const mov = data.movie_movie[0]
      return (
        <Detail
          movie={mov}
          userId={props.basic.getUserId()}
          mutation={{ addFav, starToggler, watchToggler }}
        />
      )
    }}
  </MovieOps>
)

export default props => (
  <Subscribe to={[BasicContainer]}>
    {basic => <MovieOne {...props} basic={basic} />}
  </Subscribe>
)
