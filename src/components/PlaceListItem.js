import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

class PlaceListItem extends Component {
  render () {
    const {heroImage, slug, title} = this.props.datas.node

    return (
      <div className="placelistitem">
        <h1 className="placelistitem-title">{title}</h1>
        <Link className="placelistitem-link" to={slug}>{title}</Link>

        <figure>
          <img className="placelistitem-img" src={heroImage.file.url} alt=""/>
        </figure>
      </div>
    )
  }
}

PlaceListItem.propTypes = {
  datas: PropTypes.object
}

export default PlaceListItem
