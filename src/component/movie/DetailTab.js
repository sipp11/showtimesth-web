import React from "react"
import ReactGA from "react-ga"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import ReactMarkdown from "react-markdown"
import Rating from "../Rating"
import { DetailDimBox } from "./One"

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.9rem;
  color: #cbd3dd;

  h1 {
    font-size: 1.4rem;
  }
  h2 {
    font-size: 1.3rem;
  }
  h3 {
    font-size: 1.2rem;
  }
  h4 {
    font-size: 1.1rem;
  }
  h5 {
    font-size: 1.1rem;
  }
  h6 {
    font-size: 1rem;
  }

  div {
    margin-top: 0.25rem;
    width: 100%;
    em {
      font-weight: 600;
      color: #929faf;
    }
  }
`

const VideoContainer = styled.span`
  font-size: 0.8rem;
`

const DetailTab = props => {
  const {
    movieId,
    release_date,
    duration,
    videos,
    upsertVote,
    addFav,
    starToggler,
    userFav,
    rmVote,
    aggregate: { avg, count },
    votes,
    selDetail
  } = props
  return (
    <DetailDimBox>
      <Desc>
        <VideoContainer>
          {videos.map(v => (
            <div key={`v-${v.url}-${v.source}`} className="video">
              <ReactGA.OutboundLink
                eventLabel={`youtube`}
                to={`https://youtu.be/${v.url}`}
                target="_blank"
              >
                <FontAwesome name="youtube-play" />
                <span>
                  {v.kind} {v.source}
                </span>
              </ReactGA.OutboundLink>
            </div>
          ))}
        </VideoContainer>
        <Rating
          movieId={movieId}
          upsertVote={upsertVote}
          starToggler={starToggler}
          addFav={addFav}
          userFav={userFav}
          rmVote={rmVote}
          count={count}
          initial={(avg.points / 2).toFixed(1)}
          userVote={votes.length > 0 ? (votes[0].points / 2).toFixed(1) : null}
        />
        {/* {aggregate.count > 0 && (
          <Rating />
        )} */}
        <div>
          <em>Release date</em>
          <br />
          &nbsp;&nbsp;&nbsp;{release_date}
        </div>
        <div>
          <em>Duration</em>
          <br />
          &nbsp;&nbsp;&nbsp;{duration || "-"} min
        </div>
        {selDetail.language !== undefined && (
          <>
            <div>
              <em>Director</em>
              <br />
              &nbsp;&nbsp;&nbsp;{selDetail.director || "-"}
            </div>
            <div>
              <em>Casts</em>
              <br />
              &nbsp;&nbsp;&nbsp;{selDetail.cast || "-"}
            </div>
            <div>
              <em>Storyline</em>
              <br />
              <ReactMarkdown source={selDetail.storyline || "-"} />
            </div>
          </>
        )}
      </Desc>
    </DetailDimBox>
  )
}

export default DetailTab
