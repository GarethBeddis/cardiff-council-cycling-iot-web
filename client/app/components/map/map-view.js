import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

import Searchbar from './searchbar'
import OverlayPicker from './overlay-picker'

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uYXRoYW5wZXRlcmNvbGUiLCJhIjoiY2p0YmkzanVwMGtyNTN5bzNydTNpYjB2OSJ9.ac1RTVcnsO8Ek-rgVeQe3g'

export default class MapView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedOverlay: 'none'
    }
  }

  componentDidMount () {
    // Public Style URL:
    // https://api.mapbox.com/styles/v1/jonathanpetercole/cjtb9gdix19sd1fmy23x766v3.html?fresh=true&title=true&access_token=pk.eyJ1Ijoiam9uYXRoYW5wZXRlcmNvbGUiLCJhIjoiY2p0YWhqaTRrMGFydjQzcWQ1NWR5aTk3dCJ9.V7HyWXQG5lpWtgk-17y6yw#13.5/51.480233/-3.152327/0
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/jonathanpetercole/cjtb9gdix19sd1fmy23x766v3',
      center: [-79.999732, 40.4374],
      zoom: 11
      // Cardiff
      // center: [-3.175559, 51.480802],
      // zoom: 13.75
    })

    // Prepare event listeners
    this.map.on('load', () => {
      this.props.onMapLoad()
      this.map.addSource('trees', {
        type: 'geojson',
        data: '/static/trees.geojson'
      })
      // add heatmap layer here

      // add circle layer here
      this.map.addLayer({
        id: 'air',
        type: 'circle',
        source: 'trees',
        paint: {
          // increase the radius of the circle as the zoom level and dbh value increases
          'circle-radius': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [{ zoom: 11, value: 1 }, 1.5],
              [{ zoom: 15, value: 1 }, 3],
              [{ zoom: 22, value: 1 }, 10]
            ]
          },
          'circle-color': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              // TODO: change stops to reflect AQI
              [0, 'rgb(0, 228, 0)'], // green - good
              [20, 'rgb(255, 255, 0)'], // yellow - moderate
              [30, 'rgb(255, 126, 0)'], // orange - unhealthy for sensitive groups
              [40, 'rgb(255, 0, 0)'], // red - unhealthy
              [50, 'rgb(143, 63, 151)'], // purple - very unhealthy
              [60, 'rgb(143, 63, 151)'] // maroon - hazardous
            ]
          }
        }
      }, 'road-label')
    })

    this.map.on('click', 'air', (event) => {
      this.props.onMapClick(event)
      // Show point data when clicked
      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML('<b>DBH:</b> ' + event.features[0].properties.dbh)
        .addTo(this.map)
    })

    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  }

  changeSelectedOverlay = (selection) => {
    this.setState({ selectedOverlay: selection })
  }

  componentWillUnmount () {
    this.map.remove()
  }

  render () {
    return (
      <div className='map-container'>
        <div className='toolbar'>
          <div className='left' />
          <div className='mid'>
            <Searchbar onSubmit={() => { this.props.sidebarToggle(true) }} />
          </div>
          <div className='right'>
            <OverlayPicker selected={this.state.selectedOverlay} onChange={this.changeSelectedOverlay} />
          </div>
        </div>
        <div className='map' ref={element => (this.mapContainer = element)} />
      </div>
    )
  }
}

MapView.propTypes = {
  sidebarToggle: PropTypes.func,
  onMapLoad: PropTypes.func,
  onMapClick: PropTypes.func
}
