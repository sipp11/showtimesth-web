import React, { Component } from "react"
import NowShowing from "../component/MovieNowShowing"
import Navbar from "../component/Navbar"

class AppPage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <h1>Title</h1>
        <NowShowing />
      </div>
    )
  }
}

export default AppPage
