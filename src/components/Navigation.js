import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { connect } from 'react-redux'
import { updateCurrentPlaceIndex } from '../redux/actions/placeNavigationActions'

class Navigation extends Component {
  componentDidMount () {
    this.updateActiveClass()
  }

  componentDidUpdate () {
    this.updateActiveClass()
  }

  updateActiveClass () {
    Array.from(document.querySelectorAll('nav li')).forEach((el, index) => {
      if (index <= this.props.currentPlaceIndex) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  }

  render () {
    return (
      <nav id="nav">
        <ul>
        {this.props.places.map(place => (
          <li key={place.node.title}>
            <Link to={place.node.slug}>{place.node.title}</Link>
          </li>
        ))}
        </ul>
      </nav>
    )
  }
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

Navigation.propTypes = {
  places: PropTypes.array,
  currentPlaceIndex: PropTypes.number.isRequired,
  updateCurrentPlaceIndex: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
