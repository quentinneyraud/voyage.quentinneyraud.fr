import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import brush from '../img/brush.png'
import ImageBrushEffect from '../classes/ImageBrushEffect'

class PlaceListItem extends Component {
  componentWillReceiveProps (newProps) {
    const { heroImage } = newProps.datas.node
    this.imageBrushEffect.hideCanvas()
    this.imageBrushEffect.setImage(heroImage.resolutions.src)
  }

  componentDidMount () {
    const canvas = document.getElementsByClassName('brush-effect')[0]
    this.imageBrushEffect = new ImageBrushEffect(canvas, canvas.dataset.image, canvas.dataset.pathid, canvas.dataset.brush)
  }

  render () {
    const {heroImage, slug, title} = this.props.datas.node

    return (
      <div className="placelistitem">
        <svg viewBox="0 0 1238 820" className="placelistitem-path" id="path">
          <path d="M0.615281874,322.52692 L873.384491,818.421028" id="test"></path>
          <path d="M65.8671663,0.0886253533 C65.8671663,0.0886253533 1112.16915,887.740561 1237.81911,804.59436" id="Path-2"></path>
          <path d="M736.971096,45.5048015 L1219.68768,323.313848" id="Path-3"></path>
        </svg>
        <Link to={slug}>
          <h1 className="placelistitem-title">{title}</h1>
          <canvas className="brush-effect placelistitem-canvas" data-image={heroImage.resolutions.src} data-pathid="path" data-brush={brush}/>
        </Link>
      </div>
    )
  }
}

PlaceListItem.propTypes = {
  datas: PropTypes.object
}

export default PlaceListItem
