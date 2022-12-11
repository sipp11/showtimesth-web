import React from "react"
import PropTypes from "prop-types"
import ReactGA from "react-ga"
import styled from "styled-components"
import FontAwesome from "react-fontawesome"
import Rating from "react-rating"
import { getNow } from "../lib/dt"

const Holder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .close-btn {
    display: none;
  }

  :hover {
    .close-btn {
      display: block;
    }
  }
`

const Button = styled.button`
  text-align: center;
  font-size: 0.8rem;
  color: #e3e3e3;
  background-color: transparent;
  font-weight: 600;
  margin: 0 0.25rem;
  padding: 0 0.5rem;
  border: 0;
  border-radius: 0;
  cursor: hand;

  @media screen and (min-width: 450px) {
    :hover {
      color: #ebf1fd;
      background-color: #3e8189;
    }
  }
`

const StyledRating = styled((props) => <Rating {...props} />)`
  color: ${(props) => (props.hasVoted ? "#ebdf63" : "#cbd3dd")};
`

const CountSpan = styled.span`
  margin: 0 0.5rem;
  font-size: 0.8rem;
`

class RRating extends React.Component {
  static propTypes = {
    movieId: PropTypes.number,
    upsertVote: PropTypes.object,
    rmVote: PropTypes.object,
    count: PropTypes.number.isRequired,
    initial: PropTypes.string,
    userVote: PropTypes.string,
    starToggler: PropTypes.object,
    userFav: PropTypes.array,
  }

  render() {
    const {
      count,
      movieId,
      initial,
      upsertVote,
      userFav: uf,
      addFav,
      starToggler,
      rmVote,
      userVote,
    } = this.props
    // if user voted, then show user's rating -- not average
    const initailRating = userVote || initial || 0
    const hasVoted = userVote !== null
    const isStarred = uf.length > 0 && uf.filter((f) => f.star).length > 0

    return (
      <Holder className={hasVoted ? "voted" : ""}>
        <StyledRating
          emptySymbol="fa fa-star-o fa-2x"
          fullSymbol="fa fa-star fa-2x"
          hasVoted={hasVoted}
          fractions={2}
          start={0}
          end={5}
          initialRating={initailRating}
          onClick={async (val) => {
            // if (!userVote) {
            //   // no user yet, then do nothing
            //   ReactGA.event({
            //     category: "Movie",
            //     action: `${isStarred ? "Remove" : "Add"} star`,
            //     value: movieId,
            //   })
            //   console.log("Login ก่อนนะถึงจะทำให้คะแนนบันทึกลงระบบได้จริงๆ")
            //   return
            // }
            const points = (val * 2).toFixed(0)
            const isLiked = points >= 5

            /* ------- Star ----------- */
            // [0] assume user like the movie if point >= 5
            if (uf.length === 0) {
              const vars = {
                movieId: movieId,
                star: true,
                starredSince: getNow(),
                watched: false,
                watchedSince: null,
              }
              try {
                await addFav.mutation({
                  variables: vars,
                })
              } catch (e) {
                console.log("Login ก่อนนะถึงจะทำให้คะแนนบันทึกลงระบบได้จริงๆ")
              }
              ReactGA.event({
                category: "Movie",
                action: `Add star`,
                value: movieId,
              })
            } else {
              try {
                await starToggler.mutation({
                  variables: {
                    id: uf[0].id,
                    star: isLiked,
                    starredSince: isStarred ? null : getNow(),
                  },
                })
              } catch (e) {
                console.log("Login ก่อนนะถึงจะทำให้คะแนนบันทึกลงระบบได้จริงๆ")
              }
              // [1] assume user like the movie if point >= 5
              ReactGA.event({
                category: "Movie",
                action: `${isStarred ? "Remove" : "Add"} star`,
                value: movieId,
              })
            }

            /* ------- RATING ----------- */

            // [1] dealing with rating
            try {
              await upsertVote.mutation({
                variables: {
                  movieId: movieId,
                  points: points,
                  date: getNow(),
                },
              })
            } catch (e) {
              console.log("Login ก่อนนะถึงจะทำให้คะแนนบันทึกลงระบบได้จริงๆ")
            }

            // [2] dealing with rating
            ReactGA.event({
              category: "Movie",
              action: `rating`,
              value: points,
            })
          }}
        />
        {count > 0 && (
          <CountSpan>
            {count} vote{count > 1 ? "s" : ""}
            {hasVoted && count > 1 ? ` (${initial} avg)` : ""}
          </CountSpan>
        )}
        <Button
          onClick={async () => {
            /* ------- Star ----------- */
            if (uf) {
              await starToggler.mutation({
                variables: {
                  id: uf[0].id,
                  star: false,
                  starredSince: null,
                },
              })

              // [1] assume user like the movie if point >= 5
              ReactGA.event({
                category: "Movie",
                action: `Remove star`,
                value: movieId,
              })
            }

            /* ------- REMOVE RATING ----------- */
            await rmVote.mutation({
              variables: {
                movieId: movieId,
              },
            })

            ReactGA.event({
              category: "Movie",
              action: `rating`,
              value: "NA",
            })
          }}
        >
          <FontAwesome name="close" className="close-btn fa-2x" />
        </Button>
      </Holder>
    )
  }
}

export default RRating
