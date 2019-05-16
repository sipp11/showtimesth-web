import React from "react"
import styled from "styled-components"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"
import { version, versionDate } from "../../package.json"

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
      // console.log(loading, error, data)
      if (loading) return <div>Loading...</div>
      if (!data || data.auth_user.length === 0) return <div>No data yet</div>
      const user = data.auth_user[0]
      const { basic, history } = props
      return (
        <Center>
          {user.profile_url && (
            <div>
              <figure className="image is-128x128">
                <img className="is-rounded" src={`${user.profile_url}`} />
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
            <ul>
              <li>
                <a href="https://github.com/sipp11/showtimesth-web/issues">
                  GitHub issues
                </a>{" "}
                หรือ
              </li>
              <li>
                <a href="https://facebook.com/zzyzx.io">Facebook</a>
              </li>
            </ul>
            <small className="muted">
              v{version}-{versionDate}
            </small>
          </div>
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
