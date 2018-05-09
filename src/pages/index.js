import React, { Component } from 'react'
import brush from '../img/brush.png'
import Link from 'gatsby-link'
import PropTypes from 'prop-types'
import ImageBrushEffect from '../classes/ImageBrushEffect'
import { connect } from 'react-redux'
import { updateCurrentPlaceIndex } from '../redux/actions/placeNavigationActions'

const SLIDING_INTERVAL = 1000
const WHEEL_SENSIBILITY = 100

class IndexPage extends Component {
  constructor (props) {
    super(props)

    this.onWheel = this.onWheel.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.addWheelEventListener = this.addWheelEventListener.bind(this)
    this.removeWheelEventListener = this.removeWheelEventListener.bind(this)
  }

  componentDidMount () {
    // Prevent scroll bounce
    document.getElementsByTagName('html')[0].classList.add('overflowHidden')

    // Initialize brush effect
    const canvas = document.getElementsByClassName('brush-effect')[0]
    this.imageBrushEffect = new ImageBrushEffect(canvas, canvas.dataset.image, canvas.dataset.pathid, canvas.dataset.brush)

    this.maxPlaceIndex = this.props.data.allContentfulPlace.edges.length - 1

    this.addPlaceNavigationEventListeners()
  }

  componentWillReceiveProps (newProps) {
    if (newProps.currentPlaceIndex !== this.props.currentPlaceIndex) {
      const { heroImage } = this.props.data.allContentfulPlace.edges[newProps.currentPlaceIndex].node
      this.imageBrushEffect.hideCanvas()
      this.imageBrushEffect.setImage(heroImage.resolutions.src)
    }
  }

  componentWillUnmount () {
    document.getElementsByTagName('html')[0].classList.remove('overflowHidden')
    this.removePlaceNavigationEventListeners()
  }

  render () {
    const {heroImage, slug, title} = this.props.data.allContentfulPlace.edges[this.props.currentPlaceIndex].node

    return (
      <main className="page-index">
        <div className="placelistitem">
          <svg viewBox="0 0 1238 820" className="placelistitem-path" id="path">
            <path d="M0.615281874,322.52692 L873.384491,818.421028" id="test"/>
            <path d="M65.8671663,0.0886253533 C65.8671663,0.0886253533 1112.16915,887.740561 1237.81911,804.59436" id="Path-2"/>
            <path d="M736.971096,45.5048015 L1219.68768,323.313848" id="Path-3"/>
          </svg>
          <Link to={slug}>
            <h1 className="placelistitem-title">{title}</h1>
            <canvas className="brush-effect placelistitem-canvas" data-image={heroImage.resolutions.src} data-pathid="path" data-brush={brush}/>
          </Link>
        </div>
      </main>
    )
  }

  addPlaceNavigationEventListeners () {
    this.addWheelEventListener()
    this.addKeyEventListener()
  }

  removePlaceNavigationEventListeners () {
    this.removeWheelEventListener()
    this.removeKeyEventListener()
  }

  addKeyEventListener () {
    document.addEventListener('keydown', this.onKeyDown)
  }

  removeKeyEventListener () {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  addWheelEventListener () {
    window.addEventListener('wheel', this.onWheel)
  }

  removeWheelEventListener () {
    window.removeEventListener('wheel', this.onWheel)
  }

  onWheel (e) {
    if (e.deltaY > WHEEL_SENSIBILITY)
      this.goToNext()

    if (e.deltaY < -WHEEL_SENSIBILITY)
      this.goToPrevious()
  }

  onKeyDown (e) {
    if (e.which === 38) {
      this.goToPrevious()
    } else if (e.which === 40) {
      this.goToNext()
    }
  }

  goToNext () {
    if (this.props.currentPlaceIndex < this.maxPlaceIndex) {
      this.goToIndex(this.props.currentPlaceIndex + 1)
    }
  }

  goToPrevious () {
    if (this.props.currentPlaceIndex > 0) {
      this.goToIndex(this.props.currentPlaceIndex - 1)
    }
  }

  goToIndex (index) {
    this.props.updateCurrentPlaceIndex(index)

    this.removeWheelEventListener()
    window.setTimeout(this.addWheelEventListener, SLIDING_INTERVAL)
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired,
  currentPlaceIndex: PropTypes.number.isRequired,
  updateCurrentPlaceIndex: PropTypes.func.isRequired,
}

const mapStateToProps = ({ currentPlaceIndex }) => {
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
          fields: [start],
          order: ASC
        }) {
          edges {
            node {
              title,
              slug,
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
