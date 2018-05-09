import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Map from './Map'
import Navigation from './Navigation'

class Panel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }

    this.onMenuTriggerCLick = this.onMenuTriggerCLick.bind(this)
  }

  componentDidMount () {
    this.openTimeline = new TimelineMax({
      paused: true
    })
      .to('aside', 0.5, {
        x: 0
      })

    document.getElementById('menu-trigger').addEventListener('click', this.onMenuTriggerCLick)
  }

  onMenuTriggerCLick () {
    console.log('click', this.state)
    if (this.state.open) {
      this.close()
    } else {
      this.open()
    }

    this.setState({
      open: !this.state.open
    })
  }

  open () {
    this.openTimeline.play()
  }

  close () {
    this.openTimeline.reverse()
  }

  render () {
    return (
      <aside>
        <Map places={this.props.places}/>
        <Navigation places={this.props.places}/>
      </aside>
    )
  }
}

Panel.propTypes = {
  places: PropTypes.array
}

export default Panel
