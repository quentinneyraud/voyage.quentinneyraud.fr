import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { connect } from 'react-redux'
import { updateCurrentPlaceIndex } from '../redux/actions/placeNavigationActions'

class Map extends Component {
  constructor (props) {
    super(props)

    this.onMapClick = this.onMapClick.bind(this)
    this.onMapLoad = this.onMapLoad.bind(this)
  }

  switchLanguageToFrench () {
    const isATextLayer = (layerId) => {
      return (layerId.includes('label') || ['place-city-lg-n', 'place-city-lg-s', 'place-city-md-n', 'place-city-md-s'].indexOf(layerId) > -1)
    }

    this.map.getStyle().layers.forEach((layer) => {
      if (isATextLayer(layer.id)) {
        this.map.setLayoutProperty(layer.id, 'text-field', ['get', 'name_fr'])
      }
    })
  }

  componentDidUpdate () {
    /*this.map.flyTo({
      center: [this.props.places[this.props.currentPlaceIndex].node.location.lon, this.props.places[this.props.currentPlaceIndex].node.location.lat],
      zoom: 10,
      bearing: 0,
      minZoom: 6,
      curve: 1,
      speed: 0.8
    })*/
  }

  onMapClick () {
    TweenMax.to(this.mapDomElement, 0.7, {
      x: 0
    })
  }

  addMarkers () {
    this.props.places.forEach((place) => {
      const {lon, lat} = place.node.location

      let el = document.createElement('div')
      el.classList.add('marker')
      new mapboxgl.Marker(el)
        .setLngLat({
          lng: lon,
          lat
        })
        .addTo(this.map)
    })
  }

  onMapLoad () {
    let geoJSONbase = {
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": []
          }
        }
      },
      "layout": {
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EEEEEE",
        "line-width": 2
      }
    }

    this.props.places.forEach((place) => {
      geoJSONbase.source.data.geometry.coordinates.push([
        place.node.location.lon, place.node.location.lat
      ])
    })

    this.map.addLayer(geoJSONbase)
  }

  componentDidMount () {
    this.mapDomElement = document.getElementById('map')
    mapboxgl.accessToken = 'pk.eyJ1IjoicXVlbnRpbmRldiIsImEiOiJjaWptd2Zsb2QwMDNvdmVtN3U1ZzdsZmpiIn0.uHUJcFT-FF-ERXObHzkrhg'
    this.map = new mapboxgl.Map({
      container: this.mapDomElement,
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 10,
      minZoom: 4,
      maxBounds: new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(-18.496702406814848, 36.07333151683382),
        new mapboxgl.LngLat(33.05114915567191, 59.26997072220908)
      ),
      center: [this.props.places[this.props.currentPlaceIndex].node.location.lon, this.props.places[this.props.currentPlaceIndex].node.location.lat]
    })

    this.mapDomElement.addEventListener('click', this.onMapClick)
    this.addMarkers()
    this.map.on('style.load', this.switchLanguageToFrench.bind(this))
    this.map.on('load', this.onMapLoad)
  }

  render () {
    return (
      <aside>
        <div id="map"/>
      </aside>
    )
  }
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

Map.propTypes = {
  places: PropTypes.array,
  currentPlaceIndex: PropTypes.number.isRequired,
  updateCurrentPlaceIndex: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
