import React, { Component } from "react"
import Navbar from "../component/Navbar"
import UserProfile from "../component/User"
import { PageContainer } from "../lib/piece"

class UserPage extends Component {
  render() {
    return (
      <PageContainer>
        <Navbar />
        <UserProfile {...this.props} />
      </PageContainer>
    )
  }
}

export default UserPage
