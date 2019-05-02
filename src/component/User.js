import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Subscribe } from "unstated"
import BasicContainer from "../unstated/basic"

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

const UserProfile = props => (
  <Query query={PROFILE} variables={{ userId: props.basic.getUserId() }}>
    {({ client, loading, error, data }) => {
      console.log(loading, error, data)
      if (loading) return <div>Loading...</div>
      if (!data || data.auth_user.length === 0) return <div>No data yet</div>
      const user = data.auth_user[0]
      const { basic, history } = props
      return (
        <>
          <div>
            {user.username} -- {user.profile_url || "no profile"}
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
        </>
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
