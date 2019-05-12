import React from "react"
// import FontAwesome from "react-fontawesome"
import { DimBox } from "../lib/piece"

const ListItemBlank = props => (
  <DimBox {...props} center={true}>
    {props.message || "ไม่มีข้อมูล"}
  </DimBox>
)

export default ListItemBlank
