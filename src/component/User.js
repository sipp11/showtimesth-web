import React from "react"
import styled from "styled-components"
import { Query } from "react-apollo"
import ReactGA from "react-ga"
import gql from "graphql-tag"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import { version, versionDate } from "../../package.json"
import Loading from "./Loading"
import ListItemBlank from "./ListItemBlank"

const PROFILE = gql`
  query PROFILE($userId: Int) {
    auth_user(where: { id: { _eq: $userId } }) {
      username
      profile_url
      email
      user_groups {
        group {
          name
        }
      }
    }
  }
`

const Center = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 1rem;
  text-align: center;

  a {
    color: #ebf1fd;
    text-decoration: underline;
  }
`

const UserProfile = props => (
  <Query query={PROFILE} variables={{ userId: props.basic.getUserId() }}>
    {({ client, loading, error, data }) => {
      if (loading) return <Loading />
      if (error) return <ListItemBlank message={error} />
      if (!data || data.auth_user.length === 0)
        return <ListItemBlank message={"No data yet"} />
      const user = data.auth_user[0]
      const { basic, history } = props
      return (
        <Center>
          {user.profile_url && (
            <div>
              <figure className="image is-128x128">
                <img
                  alt="profile"
                  className="is-rounded"
                  src={`${user.profile_url}`}
                />
              </figure>
            </div>
          )}
          <div>
            สวัสดี {user.username}
            {/* {user.profile_url || "no profile"} */}
            <br />
            <br />
          </div>

          <button
            className="button"
            onClick={() => {
              basic.logout(client)
              history.push("/")
            }}
          >
            Log out
          </button>

          <div>
            <br />
            อยากเพิ่ม อยากรายงาน bugs อยากช่วย
            <br />
            ก็แนะนำได้ที่
            <br />
            <ReactGA.OutboundLink
              eventLabel="feedback"
              to="https://github.com/sipp11/showtimesth-web/issues"
              target="_blank"
            >
              GitHub issues
            </ReactGA.OutboundLink>
            &nbsp;&nbsp;หรือ&nbsp;&nbsp;
            <ReactGA.OutboundLink
              eventLabel="feedback"
              to="https://facebook.com/zzyzx.io"
              target="_blank"
            >
              Facebook
            </ReactGA.OutboundLink>
          </div>
          <small className="muted">
            v{version}-{versionDate}
          </small>
        </Center>
      )
    }}
  </Query>
)

export default props => {
  return (
    <Subscribe to={[BasicContainer]}>
      {basic => <UserProfile {...props} basic={basic} />}
    </Subscribe>
  )
}
