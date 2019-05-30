import React from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import FontAwesome from "react-fontawesome"
import { Link } from "react-router-dom"
import ReactGA from "react-ga"
import BasicContainer from "../../unstated/basic"
import Loading from "../Loading"
import { BrightBox, DimBox, ifttt } from "../../lib/piece"
import { getYear, getNow } from "../../lib/dt"
import PosterItem from "./PosterItem"
import { MovieOps } from "./Ops"
import ListItemBlank from "../ListItemBlank"
import DetailTab from "./DetailTab"
import FavTab from "./FavTab"
import NearbyTab from "./NearbyTab"
import AnywhereTab from "./AnywhereTab"

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
  font-size: ${props => (props.fontSize ? props.fontSize : "1rem")};
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

export const DetailDimBox = styled(props => <DimBox {...props} />)`
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

const Tags = styled.span`
  span.tag {
    font-size: 0.7rem;
    background: transparent;
    color: #cbd3dd;
    border: 1px solid #cbd3dd;
  }
`

const Tab = styled(props => <Link {...props} />)`
  flex: 1;
  font-weight: 500;
  text-align: center;
  border: 1px solid #cbd3dd;
  padding: 0.25rem 0;
  color: ${props => (props.active === 1 ? "#363636;" : "#cbd3dd")};
  background: ${props => (props.active === 1 ? "#fff" : "transparent")};

  :first-child {
    border-left: 0;
    border-right: 0;
  }
  :last-child {
    border-left: 0;
    border-right: 0;
  }

  @media screen and (min-width: 450px) {
    :hover {
      background: #153456;
      color: #cbd3dd;
    }
  }
`

class Detail extends React.Component {
  state = {
    favLoading: false
  }

  toggleFavLoading = () => {
    this.setState({ favLoading: !this.state.favLoading })
  }

  componentDidMount() {
    const {
      movie: { id, slug }
    } = this.props
    ReactGA.pageview(`/m/${id}-${slug}`)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.tab !== newProps.tab) {
      ReactGA.event({
        category: "Movie",
        action: "Switch tab",
        label: newProps.tab
      })
    }
  }

  render() {
    const { userId, movie, tab: activeTab } = this.props
    const {
      id,
      slug,
      details,
      videos,
      tags,
      votes_aggregate: { aggregate },
      favs
    } = movie
    let selDetail = {}
    if (details.filter(d => d.language === "th").length > 0) {
      selDetail = details.filter(d => d.language === "th")[0]
    } else if (details.length > 0) {
      selDetail = details[0]
    }
    const likeCount = favs.filter(f => f.star).length
    const watchCount = favs.filter(f => f.watched).length
    const userFav = favs.filter(f => f.user_id === userId)
    const userLike =
      userFav.length > 0 && userFav.filter(f => f.star).length > 0
    const hasWatched =
      userFav.length > 0 && userFav.filter(f => f.watched).length > 0
    return (
      <>
        <FlexBrightBox marginBottom={0}>
          <div className="poster">
            <PosterItem {...movie} />
          </div>
        </FlexBrightBox>
        {/*  TITLE  */}
        <FlexDimBox marginBottom={0}>
          <div style={{ width: "110px" }} />
          <h1>
            {movie.title}
            <span className="muted"> ({getYear(movie.release_date)})</span>
            {tags && (
              <Tags className="tags">
                {tags.map((tag, ind) => (
                  <span key={`tag-${ind}`} className="tag">
                    {tag}
                  </span>
                ))}
              </Tags>
            )}
          </h1>
        </FlexDimBox>

        {/*  FAV & WATCH  */}
        <DetailDimBox marginBottom={0}>
          <ButtonContainer>
            <button
              className={`button is-small ${userLike ? "is-danger" : ""} ${
                this.state.favLoading ? "is-loading" : ""
              }`}
              disabled={userId === -1 || this.state.favLoading}
              onClick={async () => {
                this.toggleFavLoading()
                const { addFav, starToggler } = this.props.mutation
                let vars
                if (userFav.length === 0) {
                  vars = {
                    movieId: id,
                    star: true,
                    starredSince: getNow(),
                    watched: false,
                    watchedSince: null
                  }
                  await addFav.mutation({
                    variables: vars
                  })
                  ReactGA.event({
                    category: "Movie",
                    action: `Add star`,
                    value: id
                  })
                  this.toggleFavLoading()
                  return
                }
                await starToggler.mutation({
                  variables: {
                    id: userFav[0].id,
                    star: !userLike,
                    starredSince: userLike ? null : getNow()
                  }
                })

                ReactGA.event({
                  category: "Movie",
                  action: `${userLike ? "Remove" : "Add"} star`,
                  value: id
                })
                this.toggleFavLoading()
              }}
            >
              {ifttt(userLike, "Liked", "Like")}{" "}
              {likeCount > 0 ? `${likeCount}` : ""}
            </button>
            <button
              className={`button is-small ${hasWatched ? "is-danger" : ""} ${
                this.state.favLoading ? "is-loading" : ""
              }`}
              disabled={userId === -1 || this.state.favLoading}
              onClick={async () => {
                this.toggleFavLoading()
                const { addFav, watchToggler } = this.props.mutation
                let vars
                if (userFav.length === 0) {
                  vars = {
                    movieId: id,
                    star: false,
                    starredSince: null,
                    watched: true,
                    watchedSince: getNow()
                  }
                  await addFav.mutation({
                    variables: vars
                  })

                  ReactGA.event({
                    category: "Movie",
                    action: `Add watch`,
                    value: id
                  })
                  this.toggleFavLoading()
                  return
                }

                await watchToggler.mutation({
                  variables: {
                    id: userFav[0].id,
                    watched: !hasWatched,
                    watchedSince: hasWatched ? null : getNow()
                  }
                })

                ReactGA.event({
                  category: "Movie",
                  action: `${hasWatched ? "Remove" : "Add"} watch`,
                  value: id
                })
                this.toggleFavLoading()
              }}
            >
              {ifttt(hasWatched, "Watched", "Watch")}{" "}
              {watchCount > 0 ? `${watchCount}` : ""}
            </button>
          </ButtonContainer>
        </DetailDimBox>

        {/*  Tabs  */}
        <FlexDimBox marginBottom={0} fontSize="0.8rem" padding="0">
          <Tab
            to={`/m/${id}-${slug}`}
            active={
              activeTab !== "fav" &&
              activeTab !== "nearby" &&
              activeTab !== "anywhere"
                ? 1
                : 0
            }
          >
            Detail
          </Tab>
          <Tab to={`/m/${id}-${slug}/fav`} active={activeTab === "fav" ? 1 : 0}>
            <FontAwesome name="film" /> @Fav
          </Tab>
          <Tab
            to={`/m/${id}-${slug}/nearby`}
            active={activeTab === "nearby" ? 1 : 0}
          >
            <FontAwesome name="film" /> @nearby
          </Tab>
          <Tab
            to={`/m/${id}-${slug}/anywhere`}
            active={activeTab === "anywhere" ? 1 : 0}
          >
            <FontAwesome name="film" /> @anywhere
          </Tab>
        </FlexDimBox>

        {activeTab !== "fav" &&
          activeTab !== "nearby" &&
          activeTab !== "anywhere" && (
            <DetailTab
              videos={videos}
              aggregate={aggregate}
              selDetail={selDetail}
              release_date={movie.release_date}
            />
          )}

        {activeTab === "fav" && <FavTab userId={userId} movieId={id} />}
        {activeTab === "nearby" && <NearbyTab movieId={id} />}
        {activeTab === "anywhere" && <AnywhereTab movieId={id} />}
      </>
    )
  }
}

const extractMovieId = id => {
  if (isNaN(id)) return id.split("-")[0]
  return id
}

const MovieOne = props => (
  <MovieOps
    variables={{
      movieId: extractMovieId(props.id),
      userId: props.basic.getUserId() || -1
    }}
  >
    {({ addFav, starToggler, watchToggler, movie: { result } }) => {
      const { loading, data } = result

      if (loading) return <Loading />
      if (!data || !data.movie_movie) return <ListItemBlank />
      const mov = data.movie_movie[0]
      return (
        <Detail
          tab={props.tab}
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
