import React from "react"
import { Link } from "react-router-dom"
import FontAwesome from "react-fontawesome"
import styled from "styled-components"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import "./Navbar.css"

const Nav = styled.nav`
  min-height: auto;
  background-color: #35e8df !important;
  color: #333333 !important;

  a {
    color: #3b3b3b !important;
  }
  a:hover {
    color: #000000 !important;
    transform: rotate(-1.1deg);
    transform: scale(1.2);
    border-radius: 0.2rem;
  }
`

const Box = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  align-content: center;
  height: 100%;
`

const BoxItem = styled.div`
  flex: 1;
  text-align: center;
  height: 100%;

  a:hover {
    background-color: #6ffaf3 !important;
    color: #3b3b3b !important;
  }
`

const Navbar = props => (
  <Nav
    className="navbar is-primary is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <Box>
      <BoxItem>
        <Link to="/" className="navbar-item">
          Home
        </Link>
      </BoxItem>
      {!props.basic.state.token && (
        <>
          <BoxItem>
            <Link to="/login" className="navbar-item">
              Login
            </Link>
          </BoxItem>

          <BoxItem>
            <Link to="/share" className="navbar-item">
              <FontAwesome name={"share"} />
              &nbsp;Share
            </Link>
          </BoxItem>
        </>
      )}
      {props.basic.state.token && (
        <>
          <BoxItem>
            <Link to="/fav" className="navbar-item">
              <FontAwesome name={"heart"} />
              &nbsp;Fav
            </Link>
          </BoxItem>
          <BoxItem>
            <Link to="/me" className="navbar-item">
              <FontAwesome name={"user"} />
              &nbsp;{props.basic.state.username}
            </Link>
          </BoxItem>
        </>
      )}
    </Box>
  </Nav>
)

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <Navbar {...props} basic={basic} />}
    </Subscribe>
  )
}
