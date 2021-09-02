import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import { Subscribe } from "unstated"
import FontAwesome from "react-fontawesome"
import ReactGA from "react-ga"
import BasicContainer from "../../unstated/basic"
import Loading from "../Loading"
import { BrightBox, DimBox, FlexDimBox, Tab, ifttt } from "../../lib/piece"
import { getYear, getNow } from "../../lib/dt"
import { backdropSrc } from "../../lib/posterImage"
import PosterItem from "./PosterItem"
import { MovieOps } from "./Ops"
import ListItemBlank from "../ListItemBlank"
import FavTab from "./FavTab"
import NearbyTab from "./NearbyTab"
import AnywhereTab from "./AnywhereTab"
import DetailTab from "./DetailTab"

const FlexBrightBox = styled((props) => <BrightBox {...props} />)`
  display: flex;
  align-items: flex-end;
  min-height: ${(props) =>
    !props.liteVersion && props.backdrop ? `330px` : "170px"};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-image: ${(props) =>
    !props.liteVersion && props.backdrop
      ? `linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("${props.backdrop}");`
      : "none"};

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

export const DetailDimBox = styled((props) => <DimBox {...props} />)`
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

export const Tags = styled.span`
  margin-bottom: ${(props) => `${props.marginBottom} !important` || "1rem"};
  span.tag {
    font-size: 0.7rem;
    background: transparent;
    color: #cbd3dd;
    border: 1px solid #cbd3dd;
    margin-bottom: ${(props) => `${props.marginBottom} !important` || "0.5rem"};
  }
`

class Detail extends React.Component {
  state = {
    favLoading: false,
  }

  toggleFavLoading = () => {
    this.setState({ favLoading: !this.state.favLoading })
  }

  componentDidMount() {
    const {
      movie: { id, slug },
    } = this.props
    ReactGA.pageview(`/m/${id}-${slug}`)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.tab !== newProps.tab) {
      ReactGA.event({
        category: "Movie",
        action: "Switch tab",
        label: newProps.tab,
      })
    }
  }

  render() {
    const {
      userId,
      liteVersion,
      movie,
      mutation: { upsertVote, rmVote, starToggler, addFav },
      tab: activeTab,
    } = this.props
    const {
      id,
      slug,
      details,
      images,
      videos,
      tags,
      votes_aggregate: { aggregate },
      favs,
    } = movie
    let selDetail = {}
    if (details.filter((d) => d.language === "th").length > 0) {
      selDetail = details.filter((d) => d.language === "th")[0]
    } else if (details.length > 0) {
      selDetail = details[0]
    }
    const likeCount = favs.filter((f) => f.star).length
    const watchCount = favs.filter((f) => f.watched).length
    const userFav = favs.filter((f) => f.user_id === userId)
    const uf = userFav
    const hasWatched = uf.length > 0 && uf.filter((f) => f.watched).length > 0
    const isStarred = uf.length > 0 && uf.filter((f) => f.star).length > 0

    const title = `${movie.title} (${getYear(
      movie.release_date
    )}) | ShowtimesTH`
    const bdImg = backdropSrc(images)
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta
            property="og:description"
            content={`หนังเรื่อง ${movie.title}`}
          />
          <meta
            property="og:url"
            content={`${process.env.REACT_APP_FRONTEND_URL}/m/${id}-${slug}`}
          />
          <meta property="og:image" content={bdImg} />
        </Helmet>

        <FlexBrightBox
          marginBottom={0}
          liteVersion={liteVersion}
          backdrop={bdImg}
        >
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
              className={`button is-small ${isStarred ? "is-danger" : ""} ${
                this.state.favLoading ? "is-loading" : ""
              }`}
              disabled={true}
              /* NOTE: FAV works differently since v1.5 - it will be fav'ed
                       when rating is 2.5 stars or more
              */
            >
              {ifttt(isStarred, "Liked", "Like")}{" "}
              {likeCount > 0 ? `${likeCount}` : ""}
            </button>
            <button
              className={`button is-small ${hasWatched ? "is-danger" : ""} ${
                this.state.favLoading ? "is-loading" : ""
              }`}
              disabled={userId === -1 || this.state.favLoading}
              onClick={async () => {
                this.toggleFavLoading()
                const { watchToggler } = this.props.mutation
                let vars
                if (userFav.length === 0) {
                  vars = {
                    movieId: id,
                    star: false,
                    starredSince: null,
                    watched: true,
                    watchedSince: getNow(),
                  }
                  await addFav.mutation({
                    variables: vars,
                  })

                  ReactGA.event({
                    category: "Movie",
                    action: `Add watch`,
                    value: id,
                  })
                  this.toggleFavLoading()
                  return
                }

                await watchToggler.mutation({
                  variables: {
                    id: userFav[0].id,
                    watched: !hasWatched,
                    watchedSince: hasWatched ? null : getNow(),
                  },
                })

                ReactGA.event({
                  category: "Movie",
                  action: `${hasWatched ? "Remove" : "Add"} watch`,
                  value: id,
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
              duration={movie.duration}
              release_date={movie.release_date}
              upsertVote={upsertVote}
              userFav={userFav}
              addFav={addFav}
              starToggler={starToggler}
              rmVote={rmVote}
              votes={movie.votes}
              movieId={id}
            />
          )}

        {activeTab === "fav" && <FavTab userId={userId} movieId={id} />}
        {activeTab === "nearby" && <NearbyTab movieId={id} />}
        {activeTab === "anywhere" && <AnywhereTab movieId={id} />}
      </>
    )
  }
}

const extractMovieId = (id) => {
  if (isNaN(id)) return id.split("-")[0]
  return id
}

const MovieOne = (props) => (
  <MovieOps
    variables={{
      movieId: extractMovieId(props.id),
      userId: props.basic.getUserId() || -1,
    }}
  >
    {({
      addFav,
      starToggler,
      watchToggler,
      upsertVote,
      rmVote,
      movie: { result },
    }) => {
      const { loading, data } = result
      if (loading) return <Loading />
      if (!data || !data.movie_movie) return <ListItemBlank />
      const mov = data.movie_movie[0]
      if (!mov) {
        // NOTE: it's likely that this movie has been merged to another
        //       redirect to front page then
        setTimeout(() => {
          props.history.push("/")
        }, 500)
        return <Loading />
      }
      return (
        <Detail
          tab={props.tab}
          movie={mov}
          liteVersion={props.basic.getPref("liteVersion") === "true"}
          userId={props.basic.getUserId()}
          mutation={{ addFav, starToggler, watchToggler, upsertVote, rmVote }}
        />
      )
    }}
  </MovieOps>
)

export default (props) => (
  <Subscribe to={[BasicContainer]}>
    {(basic) => <MovieOne {...props} basic={basic} />}
  </Subscribe>
)
