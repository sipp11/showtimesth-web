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

const StyledRating = styled(props => <Rating {...props} />)`
  color: ${props => (props.hasVoted ? "#ebdf63" : "#cbd3dd")};
`

const CountSpan = styled.span`
  margin: 0 0.5rem;
  font-size: 0.8rem;
`

class RRating extends React.Component {
  static propTypes = {
    movieId: PropTypes.number,
    upsertVote: PropTypes.func,
    rmVote: PropTypes.func,
    count: PropTypes.number.isRequired,
    initial: PropTypes.number,
    userVote: PropTypes.number
  }

  render() {
    const { count, movieId, initial, upsertVote, rmVote, userVote } = this.props
    // if user voted, then show user's rating -- not average
    const initailRating = userVote || initial || 0
    const hasVoted = userVote !== null

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
          onClick={async val => {
            await upsertVote.mutation({
              variables: {
                movieId: movieId,
                points: (val * 2).toFixed(0),
                date: getNow()
              }
            })

            ReactGA.event({
              category: "Movie",
              action: `rating`,
              value: (val * 2).toFixed(0)
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
            await rmVote.mutation({
              variables: {
                movieId: movieId
              }
            })

            ReactGA.event({
              category: "Movie",
              action: `rating`,
              value: "NA"
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
