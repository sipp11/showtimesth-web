import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { imgSrc } from "../../lib/posterImage"

export const CenterPosterBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`

export const LeftyPosterBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin-bottom: 2rem;
`

const Item = styled.div`
  width: 110px;
  color: #e3e3e3;
  font-size: 0.85rem;
  font-weight: 400;
  text-align: center;
  padding-bottom: 0.3rem;
`

const PosterItem = props => (
  <Link to={`/m/${props.id}-${props.slug}`}>
    <Item>
      <img src={imgSrc(props.images)} width="95" alt={`${props.title}`} />
      {props.show === true && props.value}
    </Item>
  </Link>
)

export default PosterItem
