import React from 'react'
import PropTypes from 'prop-types'

import SidebarPage from '../../components/sidebar/sidebar-page'
import Section from '../../components/common/section'
import Card from '../../components/common/card'

import IconAirPollution from './icons/air-pollution.svg'
import IconNoise from './icons/noise.svg'

export default class DetailssPage extends React.Component {
  getLngLat = () => {
    // Get the longitude and latitude from the URL
    let params = new URLSearchParams(this.props.location.search.slice(1))
    return { lng: params.get('lng'), lat: params.get('lat') }
  }

  componentWillMount () {
    // Set the radius
    this.props.setRadius(this.getLngLat())
  }

  componentDidUpdate (prevProps) {
    // If the location changed (new coordinates), update the radius
    if (prevProps.location !== this.props.location) {
      this.props.setRadius(this.getLngLat())
    }
  }

  componentWillUnmount () {
    // Remove the radius
    this.props.setRadius(null)
  }

  render () {
    return (
      <SidebarPage title='Details' canGoBack>
        <Section title='Map Location'>
          <Card>
            <h1>Longitude:</h1>
            {this.getLngLat().lng}
            <h1>Latitude:</h1>
            {this.getLngLat().lat}
          </Card>
        </Section>
        <Section title='Area 24 Hour Averages'>
          <Card className='average' link={``}>
            <IconAirPollution className='icon' />
            <div className='details'>
              <h1>Air Pollution</h1>
              <span className='value'>Moderate</span>
            </div>
          </Card>
          <Card className='average' link={``}>
            <IconNoise className='icon' />
            <div className='details'>
              <h1>Noise</h1>
              <span className='value'>00 dB</span>
            </div>
          </Card>
        </Section>
      </SidebarPage>
    )
  }
}

DetailssPage.propTypes = {
  location: PropTypes.object,
  setRadius: PropTypes.func
}
