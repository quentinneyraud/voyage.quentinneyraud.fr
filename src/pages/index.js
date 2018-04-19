import React, { Component } from 'react'
import PlaceListItem from '../components/PlaceListItem'

const SLIDING_INTERVAL = 1000
const WHEEL_SENSIBILITY = 100

class IndexPage extends Component {
  constructor () {
    super()

    this.state = {
      currentPlaceIndex: 0
    }

    this.onWheel = this.onWheel.bind(this)
    this.addWheelEventListener = this.addWheelEventListener.bind(this)
    this.removeWheelEventListener = this.removeWheelEventListener.bind(this)
  }

  componentDidMount () {
    this.index = 0
    this.maxPlaceIndex = this.props.data.allContentfulPlace.edges.length - 1

    this.addWheelEventListener()
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

  goToNext () {
    if (this.state.currentPlaceIndex < this.maxPlaceIndex) {
      this.goToIndex(this.state.currentPlaceIndex + 1)
    }
  }

  goToPrevious () {
    if (this.state.currentPlaceIndex > 0) {
      this.goToIndex(this.state.currentPlaceIndex - 1)
    }
  }

  goToIndex (index) {
    this.setState({
      currentPlaceIndex: index
    })

    this.removeWheelEventListener()
    window.setTimeout(this.addWheelEventListener, SLIDING_INTERVAL)
  }

  render () {
    return (
      <main>
        <PlaceListItem datas={this.props.data.allContentfulPlace.edges[this.state.currentPlaceIndex]}/>
      </main>
    )
  }
}

export const allPlaces = graphql`
    query allPlaces {
        allContentfulPlace {
          edges {
            node {
              title,
              slug,
              heroImage {
                file {
                  url
                }
              }
            }
          }
        }
    }
`

export default IndexPage
