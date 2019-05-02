import React from "react"
import FontAwesome from "react-fontawesome"
import { DimBox } from "../lib/piece"

const Loading = props => (
  <DimBox center={true}>
    <FontAwesome name="cog" spin size="2x" />
  </DimBox>
)

export default Loading
