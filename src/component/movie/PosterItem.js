import React from "react"
import styled from "styled-components"
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
  <Item>
    <img src={imgSrc(props.images)} width="95" />
    {props.show && props.value}
  </Item>
)

export default PosterItem
