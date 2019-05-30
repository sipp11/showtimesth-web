import React, { Component } from "react"
import PropTypes from "prop-types"

export default class GoogleAds extends Component {
  static propTypes = {
    client: PropTypes.string,
    format: PropTypes.string.isRequired,
    layoutKey: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    client: process.env.REACT_APP_AD_CLIENT,
    format: "fluid",
    layoutKey: "-hb-7+2h-1m-4u",
    className: "",
    style: { display: "block" }
  }

  componentDidMount() {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({})
  }

  render() {
    if (!process.env.REACT_APP_AD_CLIENT) return null
    return (
      <ins
        className={`adsbygoogle ${this.props.className}`}
        style={this.props.style}
        data-ad-client={this.props.client}
        data-ad-slot={this.props.slot}
        data-ad-layout-key={this.props.layoutKey}
        data-ad-format={this.props.format}
      />
    )
  }
}
