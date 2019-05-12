import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { imgSrc } from "../../lib/posterImage"

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
      {props.show && props.value}
    </Item>
  </Link>
)

export default PosterItem
