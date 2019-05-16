import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import ListItemBlank from "../ListItemBlank"
import Loading from "../Loading"

const Box = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const Item = styled(Link)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 48%;

  height: 6rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  font-size: 1rem;
  text-align: center;

  padding: auto;
  margin: 1%;

  background: #2b3f56;
  color: #e3e3e3;
  :hover {
    color: #ebf1fd;
  }
  :active {
    color: #808a96;
    background: #3e6189;
  }
  small {
    font-size: 0.8rem;
  }

  @media screen and (min-width: 450px) {
    :hover {
      color: #e3e3e3;
    }
  }
`

const CHAIN_QUERY = gql`
  query CHAIN_QUERY {
    theater_theatergroup(order_by: { id: asc }) {
      code
      thai
      english
    }
  }
`

const Chain = () => (
  <Query query={CHAIN_QUERY}>
    {({ loading, data, error }) => {
      if (loading) return <Loading />
      if (error) return <ListItemBlank message={error} />
      if (!data || !data.theater_theatergroup) return <ListItemBlank />
      const items = data.theater_theatergroup
      return (
        <>
          <h1>เครือโรงหนัง</h1>
          <Box>
            {items.map(chain => (
              <Item to={`/list/${chain.code}`} key={`c-${chain.code}`}>
                {chain.thai} <br />
                <small>{chain.english}</small>
              </Item>
            ))}
          </Box>
        </>
      )
    }}
  </Query>
)

export default Chain
