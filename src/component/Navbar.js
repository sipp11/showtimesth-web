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

  @media screen and (min-width: 450px) {
    a:hover {
      color: #000000 !important;
      transform: rotate(-1.1deg);
      transform: scale(1.2);
      border-radius: 0.2rem;
    }
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

  @media screen and (min-width: 450px) {
    a:hover {
      background-color: #6ffaf3 !important;
      color: #3b3b3b !important;
    }
  }
`

const roundRobinUrls = (currentUrl, choices) => {
  const ind = choices.indexOf(currentUrl)
  if (ind == -1 || ind == choices.length - 1) return choices[0]
  return choices[ind + 1]
}

const Navbar = props => (
  <Nav
    className="navbar is-primary is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <Box>
      <BoxItem>
        <Link
          to={roundRobinUrls(props.location.pathname, ["/", "/comingsoon"])}
          className="navbar-item"
        >
          &nbsp;
          <FontAwesome name={"home"} />
          &nbsp;
        </Link>
      </BoxItem>
      {!props.basic.state.token && (
        <>
          <BoxItem>
            <Link to="/login" className="navbar-item">
              Login
            </Link>
          </BoxItem>

          {/* <BoxItem>
            <Link to="/share" className="navbar-item">
              <FontAwesome name={"share"} />
              &nbsp;Share
            </Link>
          </BoxItem> */}
        </>
      )}
      {props.basic.state.token && (
        <>
          <BoxItem>
            <Link
              to={roundRobinUrls(props.location.pathname, [
                "/fav",
                "/fav/movie"
              ])}
              className="navbar-item"
            >
              <FontAwesome name={"heart"} />
              &nbsp;Fav
            </Link>
          </BoxItem>
          <BoxItem>
            <Link to="/me" className="navbar-item">
              <FontAwesome name={"user"} />
              &nbsp;Me
            </Link>
          </BoxItem>
        </>
      )}
      <BoxItem>
        <Link to="/search" className="navbar-item">
          &nbsp;
          <FontAwesome name="search" />
          &nbsp;
        </Link>
      </BoxItem>
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
