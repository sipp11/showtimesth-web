import React from "react"
import { Link } from "react-router-dom"
import FontAwesome from "react-fontawesome"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import "./Navbar.css"

const Navbar = props => (
  <nav
    className="navbar is-primary is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <div className={`navbar-menu ${props.ui ? "is-active" : ""}`}>
      <div className="navbar-end">
        <Link to="/" className="navbar-item">
          Home
        </Link>
        {/* <Link to="/help" className="navbar-item">
          ช่วยเหลือ
        </Link> */}
        {!props.basic.state.token && (
          <Link to="/login" className="navbar-item">
            Login
          </Link>
        )}
        {props.basic.state.token && (
        <Link to="/user" className="navbar-item">
          <FontAwesome name={"user"} />
          &nbsp;Profile
        </Link>
        )}
        <div className="navbar-item">
          <div className="buttons">
            {/* <User>
              {({ data: { me } }) => {
                if (!me)
                  return (
                    <>
                      <Link to="/signup" className="button is-primary">
                        <strong>Sign up</strong>
                      </Link>
                      <Link to="/signup" className="button is-light">
                        Log in
                      </Link>
                    </>
                  )
                return (
                  <>
                    <Link to="/me" className="button is-primary is-large">
                      {me.first_name} {me.last_name}
                    </Link>
                    <Signout label="ออกจากระบบ" />
                  </>
                )
              }}
            </User> */}
          </div>
        </div>
      </div>
    </div>
  </nav>
)

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <Navbar {...props} basic={basic} />}
    </Subscribe>
  )
}
