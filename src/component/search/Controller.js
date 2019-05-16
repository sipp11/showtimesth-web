import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { DimBox } from "../../lib/piece"

const FlexDimBox = styled(props => <DimBox {...props} />)`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  align-content: center;
  padding: 0;
  margin-bottom: 0;
`

const Button = styled.button`
  min-width: 10rem;
  max-width: 50vw;
  text-align: center;
  font-size: 0.8rem;
  color: #e3e3e3;
  background-color: #3e6189;
  font-weight: 600;
  padding: 0.25rem 0;
  border: 0;
  border-radius: 0;

  @media screen and (min-width: 450px) {
    :hover {
      color: #ebf1fd;
      background-color: #3e8189;
    }
  }
`

const ButtonLink = styled(Link)`
  min-width: 10rem;
  max-width: 50vw;
  text-align: center;
  font-size: 0.8rem;
  color: #e3e3e3;
  background-color: #3e6189;
  font-weight: 600;
  padding: 0.25rem 0;
  border: 0;
  border-radius: 0;

  @media screen and (min-width: 450px) {
    :hover {
      color: #ebf1fd;
      background-color: #3e8189;
    }
  }
`

const Controller = props => (
  <FlexDimBox>
    <ButtonLink to="/list">เลือกจากทั้งหมด</ButtonLink>
    {props.acquirePosition && (
      <Button
        className="button"
        onClick={() => {
          props.activateNearby()
        }}
      >
        Nearby
      </Button>
    )}
  </FlexDimBox>
)

export default Controller
