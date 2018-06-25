import React, { Component } from 'react'
import brush from '../img/brush.png'
import { navigateTo } from 'gatsby-link'
import PropTypes from 'prop-types'
import ImageBrushEffect from '../classes/ImageBrushEffect'
import { connect } from 'react-redux'
import { updateCurrentPlaceIndex } from '../redux/actions/placeNavigationActions'
let SplitTextButton
let TweenMax
let DraggableSkew
if (typeof window !== `undefined`) {
  SplitTextButton = require('../classes/SplitTextButton')
  TweenMax = require("gsap/umd/TweenMax")
  DraggableSkew = require('../classes/DraggableSkew')
}

const SKEW_FORCE = 0.5
const MAX_SKEW_VALUE = 75

class IndexPage extends Component {
  loadImage (path) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(path)
      img.src = path
    })
      .then(this.onImageLoaded.bind(this))
  }

  onImageLoaded () {
    this.loadedImages++
    TweenMax.to('#middle-line', 0.3, {
      scaleX: this.loadedImages / this.totalImages
    })
  }

  onAllImageLoaded () {
    TweenMax.to('.list-item-title', 0.5, {
      autoAlpha: 1
    })

    this.splitTextButton.show()

    this.splitTextButton.setLink(this.slugs[0])
    Promise.all([this.imageBrushEffect.setImage(this.paths[0]), this.imageBrushEffect.setBrush(brush)])
      .then(() => {
        this.imageBrushEffect.show()
      })
  }

  componentDidMount () {
    this.loadedImages = 0
    // Load images
    const loadImg = (...paths) => {
      this.totalImages = paths.length
      return Promise.all(paths.map(this.loadImage.bind(this)))
    }
    this.paths = this.props.data.allContentfulPlace.edges.map(edge => {
      return edge.node.heroImage.resolutions.src
    }).concat(brush)
    loadImg(...this.paths)
      .then(this.onAllImageLoaded.bind(this))

    // get infos
    this.slugs = this.props.data.allContentfulPlace.edges.map(edge => {
      return edge.node.slug
    })

    // SplitText
    this.splitTextButton = new SplitTextButton('#link')

    // Initialize brush effect
    const canvas = document.getElementsByClassName('brush-effect')[0]
    this.imageBrushEffect = new ImageBrushEffect(canvas, canvas.dataset.pathid)

    const elements = Array.from(document.querySelectorAll('#list li'))
    elements[0].classList.add('active')

    // Prevent scroll bounce
    document.getElementsByTagName('html')[0].classList.add('overflowHidden')

    this.draggable = new DraggableSkew(document.getElementById('list'), {
      moveOnWheel: true,
      moveOnClick: true,
      moveOnKey: true,
      resizeListener: true
    }, {})

    const tt = (index) => {
      elements.forEach(el => el.classList.remove('active'))
      elements.slice(0, index + 1).forEach(el => el.classList.add('active'))
    }

    this.draggable.on('newIndex', (datas) => {
      this.splitTextButton.show()
      this.splitTextButton.setLink(this.slugs[datas.newIndex])
      this.imageBrushEffect.setImage(this.paths[datas.newIndex])
        .then(this.imageBrushEffect.show.bind(this.imageBrushEffect))
      this.skewElements(0, 0.3)

      elements.forEach(el => el.classList.remove('active'))
      elements.slice(0, datas.newIndex + 1).forEach(el => el.classList.add('active'))
    })
    this.draggable.on('onDrag', (e) => {
      this.splitTextButton.hide()
      this.imageBrushEffect.hide()
      if (this.draggable.draggableInstance.x === this.draggable.draggableInstance.minX || this.draggable.draggableInstance.x === this.draggable.draggableInstance.maxX) {
        // Fix bug on bounds, e.movementX is the last known value, but not 0
        this.skewElements(0, 0.3)
      } else {
        this.skewElements(e.movementX * -1 * SKEW_FORCE, 0.1)
      }
    })
    this.draggable.on('onDragEnd', () => {
      this.skewElements(0, 0.3)
    })
    this.draggable.on('startGoTo', (datas) => {
      this.imageBrushEffect.hide()
      this.splitTextButton.hide()
      tt(datas.newIndex)
      if (datas.newIndex > datas.oldIndex) {
        this.skewElements(15, 0.3)
      } else {
        this.skewElements(-15, 0.3)
      }
    })
  }

  skewElements (skewValue, duration) {
    if (Math.abs(skewValue) > MAX_SKEW_VALUE) {
      skewValue = Math.sign(skewValue) * MAX_SKEW_VALUE
    }

    TweenMax.to(this.draggable.elements, duration, {
      skewX: skewValue,
      skewType: 'simple'
    })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.currentPlaceIndex !== this.props.currentPlaceIndex) {
      this.draggable.goToIndex(newProps.currentPlaceIndex)
      this.imageBrushEffect.setImage(this.paths[newProps.currentPlaceIndex])
    }
  }

  componentWillUnmount () {
    document.getElementsByTagName('html')[0].classList.remove('overflowHidden')
  }

  render () {
    const items = this.props.data.allContentfulPlace.edges.map(edge => (
      <li key={edge.node.id} className="list-item">
        <span className="list-item-title">{edge.node.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "")}</span>
      </li>
    ))

    return (
      <main className="page-index">
        <svg viewBox="0 0 1238 820" className="placelistitem-path" id="path">
          <path d="M0.615281874,322.52692 L873.384491,818.421028" id="test"/>
          <path d="M65.8671663,0.0886253533 C65.8671663,0.0886253533 1112.16915,887.740561 1237.81911,804.59436"
                id="Path-2"/>
          <path d="M736.971096,45.5048015 L1219.68768,323.313848" id="Path-3"/>
        </svg>
        <canvas className="brush-effect placelistitem-canvas" data-pathid="path"/>
        <div id="content">
          <ul id="list">
            {items}
          </ul>
          <a href="http://www.instagram.com/quentin_neyraud" target="blank" id="instagram">Instagram</a>
          <a id='link'>Explorer</a>
          <div id="middle-line"/>
        </div>
      </main>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired,
  currentPlaceIndex: PropTypes.number.isRequired,
  updateCurrentPlaceIndex: PropTypes.func.isRequired,
}

const mapStateToProps = ({currentPlaceIndex}) => {
  return {
    currentPlaceIndex
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentPlaceIndex: (newPlaceIndex) => dispatch(updateCurrentPlaceIndex(newPlaceIndex))
  }
}

export const allPlaces = graphql`
    query allPlaces {
        allContentfulPlace (sort: {
          fields: [start]
          order: ASC
        }) {
          edges {
            node {
            id
              title
              slug
              heroImage {
                resolutions (width: 800, height: 500, quality: 100) {
                  src
                }
              }
            }
          }
        }
    }
`

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)
