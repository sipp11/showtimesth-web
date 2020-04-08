import React, { Component } from "react"
import { Helmet } from "react-helmet"
import Navbar from "../component/Navbar"
import UserProfile from "../component/User"
import { PageContainer } from "../lib/piece"

class UserPage extends Component {
  render() {
    return (
      <PageContainer>
        <Helmet>
          <title>Profile | ShowtimesTH</title>
        </Helmet>
        <Navbar location={this.props.location} />
        <UserProfile {...this.props} />
      </PageContainer>
    )
  }
}

export default UserPage
