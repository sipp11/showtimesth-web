import React from "react"
import { Link } from "react-router-dom"
import { ListItem } from "../../lib/piece"
import { Tags } from "./One"
import Rating from "react-rating"

const MovieListItem = props => {
  const m = props.movie
  const {
    votes_aggregate: {
      aggregate: {
        avg: { points }
      }
    }
  } = m
  return (
    <Link to={`/m/${m.id}-${m.slug}`}>
      <ListItem>
        <div className="content">
          <div className="pull-right">
            {points && (
              <Rating
                initialRating={(points / 2).toFixed(1)}
                emptySymbol="fa fa-star-o"
                fullSymbol="fa fa-star"
                readonly={true}
                fractions={2}
                start={0}
                end={5}
              />
            )}
          </div>
          <p>
            <strong>
              {m.title} {m.release_date && `(${m.release_date.substr(0, 4)})`}
            </strong>
            {m.tags && (
              <Tags className="tags" marginBottom={0}>
                {m.tags.map((tag, ind) => (
                  <span key={`tag-${ind}`} className="tag">
                    {tag}
                  </span>
                ))}
              </Tags>
            )}
          </p>
        </div>
      </ListItem>
    </Link>
  )
}

export default MovieListItem
