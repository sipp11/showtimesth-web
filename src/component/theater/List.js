import React from "react"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import ReactGA from "react-ga"
import ListItemBlank from "../ListItemBlank"
import Loading from "../Loading"
import { TheaterResult } from "../search/Result"
import { Breadcrum, ListItem } from "../../lib/piece"

const THEATER_OF_CHAIN_QUERY = gql`
  query THEATER_OF_CHAIN_QUERY($chainCode: String!, $offset: Int!) {
    theater_theatergroup(where: { code: { _eq: $chainCode } }) {
      thai
      english
    }
    theater_theater(
      where: { hide: { _eq: false }, chain: { code: { _eq: $chainCode } } }
      offset: $offset
      order_by: { english: asc }
    ) {
      id
      slug
      english
      thai
      point
    }
  }
`

export const TheaterListItem = props => (
  <Link to={`/t/${props.theater.id}-${props.theater.slug}`}>
    <ListItem>
      <article>
        <div className="content">
          <p>
            <strong>{props.theater.english}</strong>
            <br />
            <small>{props.theater.thai}</small>
          </p>
        </div>
      </article>
    </ListItem>
  </Link>
)

class List extends React.Component {
  state = {
    bottomReached: false,
    lastOffset: -1
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight
  }

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling)
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling)
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("t-results")
    if (this.isBottom(wrappedElement)) {
      this.setState({ bottomReached: true })
      document.removeEventListener("scroll", this.trackScrolling)
    }
  }

  resetTrackingScrolling = (fetchMore, offset) => {
    const { lastOffset } = this.state
    const { subpage } = this.props
    ReactGA.event({
      category: "Theater",
      action: "Load more",
      label: subpage
    })
    setTimeout(() => {
      this.setState({ bottomReached: false, lastOffset: offset })
      if (lastOffset === offset) return

      fetchMore({
        variables: {
          chainCode: subpage,
          offset: offset
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return Object.assign({}, prev, {
            theater_theater: [
              ...prev.theater_theater,
              ...fetchMoreResult.theater_theater
            ]
          })
        }
      })
      // delay again not to track scrolling until new one arrived
      setTimeout(() => {
        if (lastOffset !== offset)
          document.addEventListener("scroll", this.trackScrolling)
      }, 1500)
    }, 100)
  }

  render() {
    const { subpage } = this.props
    const { bottomReached } = this.state
    return (
      <Query
        query={THEATER_OF_CHAIN_QUERY}
        variables={{ chainCode: subpage, offset: 0 }}
      >
        {({ loading, data, error, fetchMore }) => {
          if (error) return <ListItemBlank message={error} />
          if (!data || !data.theater_theater) return <ListItemBlank />
          const items = data.theater_theater
          const chains = data.theater_theatergroup

          if (bottomReached) {
            this.resetTrackingScrolling(fetchMore, items.length)
          }
          return (
            <>
              <Breadcrum
                className="breadcrumb has-bullet-separator is-centered"
                aria-label="breadcrumbs"
              >
                <ul>
                  <li>
                    <Link to={`/list`}>เครือทั้งหมด</Link>
                  </li>
                </ul>
              </Breadcrum>
              <h1>
                {chains[0].thai}&nbsp;({chains[0].english})
              </h1>
              <div id="t-results">
                <TheaterResult theaters={items} />
                {loading && <Loading />}
              </div>
            </>
          )
        }}
      </Query>
    )
  }
}

export default List
