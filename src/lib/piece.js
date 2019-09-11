import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

export const ifttt = (cond, yes, no) => {
  return cond ? yes : no
}

export const PageContainer = styled.div`
  padding-bottom: 80px;
  background-color: #282c34;
  color: #e3e3e3;

  h1 {
    font-weight: 500;
    font-size: 1.3rem;
    padding: 1rem;
    padding-left: 1rem;
    color: #ebf1fd;
  }

  muted,
  .muted {
    color: #808a96;
  }
`

export const BrightBox = styled.div`
  background-color: #3e6189;
  border-radius: 0.2rem;
  margin-bottom: ${props =>
    props.marginBottom !== undefined ? props.marginBottom : "0.5rem"};
  padding: 0.5rem 1rem;
  color: #cbd3dd;
`

export const DimBox = styled.div`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : "#2b3f56"};
  border-radius: 0.2rem;

  padding: ${props => (props.padding ? props.padding : "0.5rem 1rem")};
  color: #e3e3e3;
  font-size: ${props => (props.fontSize ? props.fontSize : "1rem")};

  margin-bottom: ${props =>
    props.marginBottom !== undefined ? props.marginBottom : "0.5rem"};
  text-align: ${props => (props.center ? "center" : "left")};

  strong {
    color: #ebf1fd;
  }
  .title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ebf1fd;
    margin-bottom: 0.5rem;
  }
`

export const FlexDimBox = styled(props => <DimBox {...props} />)`
  display: flex;
  align-items: flex-start;
  font-size: ${props => (props.fontSize ? props.fontSize : "1rem")};
  h1 {
    padding: 0 0.5rem;
    font-size: 1.8rem;
    flex: 1;
  }

  span.video {
    display: inline-block;

    a > span.fa {
      vertical-align: middle;
      font-size: 40px;
    }
    a > span {
      padding-left: 5px;
    }
  }
  @media screen and (max-width: 450px) {
    h1 {
      padding: 0;
      font-size: 1.1rem;
    }
  }
`

export const Tab = styled(props => <Link {...props} />)`
  flex: 1;
  font-weight: 500;
  text-align: center;
  border: 1px solid #cbd3dd;
  padding: 0.25rem 0;
  color: ${props => (props.active === 1 ? "#363636;" : "#cbd3dd")};
  background: ${props => (props.active === 1 ? "#fff" : "transparent")};

  :first-child {
    border-left: 0;
    border-right: 0;
  }
  :last-child {
    border-left: 0;
    border-right: 0;
  }

  @media screen and (min-width: 450px) {
    :hover {
      background: #153456;
      color: #cbd3dd;
    }
  }
`

export const HeaderLink = styled(props => <Link {...props} />)`
  margin-left: 1.2rem;
  font-size: 0.95rem;

  color: #808a96;

  @media screen and (min-width: 450px) {
    :hover {
      color: #e3e3e3;
    }
  }
`

export const ListItem = styled.div`
  background-color: #1d2733;
  border-bottom: 1px solid #0e1824;
  padding: 0.5rem 1rem;
  /* color: #89919b; */
  color: #cbd3dd;
`

export const Breadcrum = styled.nav`
  font-size: 0.85rem;
  margin-bottom: 0 !important;

  a {
    color: #e3e3e3;
  }

  .is-active > a {
    color: #808a96 !important;
  }

  @media screen and (min-width: 450px) {
    a:hover {
      color: #ebf1fd;
    }
  }
`
