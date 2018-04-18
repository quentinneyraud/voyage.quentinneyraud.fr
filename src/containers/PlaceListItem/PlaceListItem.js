import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

class PlaceListItem extends Component {
  render () {
    const {heroImage, slug, title} = this.props.datas.node

    return (
      <div>
        <h1>{title}</h1>
        <Link to={slug}>{title}</Link>
        <img src={heroImage.resize.src} alt=""/>
      </div>
    )
  }
}

PlaceListItem.propTypes = {
  datas: PropTypes.object
}

export default PlaceListItem
