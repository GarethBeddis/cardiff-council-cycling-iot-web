import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import axios from 'axios'

import SidebarPageManager from '../components/sidebar/sidebar-page-manager'
import SidebarPage from '../components/sidebar/sidebar-page'
import Section from '../components/common/section'
import Card from '../components/common/card'

import DetailsSubpage from './explore-page/details-subpage'

import IconAirPollution from './explore-page/icons/air-pollution.svg'
import IconNoise from './explore-page/icons/noise.svg'

export default class ExplorePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      noiseAverage: 0,
      NO2Average: 0,
      PM10Average: 0,
      PM25Average: 0,
      airQualityIndex: 'N/A'
    }
  }

  componentWillMount () {
    this.getNoiseAverage()
    this.getNO2Average()
    this.getPM10Average()
    this.getPM25Average()
    this.getAirQualityIndex(this.state.NO2Average, this.state.PM10Average, this.state.PM25Average)
  }

  componentDidUpdate (prevProps) {
    // If the map was clicked, show the details page
    if (prevProps.mapState !== this.props.mapState) {
      if (this.props.mapState.clickLocation) {
        this.props.history.push({
          pathname: `${this.props.match.path}/details`,
          search: '?lng=' + this.props.mapState.clickLocation.lng + '&' +
            'lat=' + this.props.mapState.clickLocation.lat
        })
      }
    }
  }

  getAirQualityIndex = (no2, pm25, pm10) => {
    let highestIndex = Math.max(this.getNO2Index(no2), this.getPM25Index(pm25), this.getPM10Index(pm10))
    let aqi
    if (highestIndex <= 3) {
      aqi = 'Low'
    } else if (highestIndex <= 6) {
      aqi = 'Moderate'
    } else if (highestIndex <= 9) {
      aqi = 'High'
    } else if (highestIndex > 9) {
      aqi = 'Very High'
    } else {
      aqi = 'N/A'
    }
    this.setState({
      airQualityIndex: aqi
    })
    return aqi
  }

  getNO2Index = (no2) => {
    if (no2 < 68) {
      return 1
    } else if (no2 <= 134) {
      return 2
    } else if (no2 <= 200) {
      return 3
    } else if (no2 <= 267) {
      return 4
    } else if (no2 <= 334) {
      return 5
    } else if (no2 <= 400) {
      return 6
    } else if (no2 <= 467) {
      return 7
    } else if (no2 <= 534) {
      return 8
    } else if (no2 <= 535) {
      return 9
    } else if (no2 >= 536) {
      return 10
    }
  }

  getPM25Index = (pm25) => {
    if (pm25 < 12) {
      return 1
    } else if (pm25 <= 23) {
      return 2
    } else if (pm25 <= 35) {
      return 3
    } else if (pm25 <= 41) {
      return 4
    } else if (pm25 <= 47) {
      return 5
    } else if (pm25 <= 53) {
      return 6
    } else if (pm25 <= 58) {
      return 7
    } else if (pm25 <= 64) {
      return 8
    } else if (pm25 <= 70) {
      return 9
    } else if (pm25 >= 71) {
      return 10
    }
  }

  getPM10Index = (pm10) => {
    if (pm10 < 17) {
      return 1
    } else if (pm10 <= 33) {
      return 2
    } else if (pm10 <= 50) {
      return 3
    } else if (pm10 <= 58) {
      return 4
    } else if (pm10 <= 66) {
      return 5
    } else if (pm10 <= 75) {
      return 6
    } else if (pm10 <= 83) {
      return 7
    } else if (pm10 <= 91) {
      return 8
    } else if (pm10 <= 100) {
      return 9
    } else if (pm10 > 101) {
      return 10
    }
  }

  getNoiseAverage = () => {
    axios.get('/api/web/noiseAverage')
      .then((response) => {
        console.log('Noise' + response.data)
        this.setState({
          noiseAverage: response.data.toFixed(0)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getNO2Average = () => {
    axios.get('/api/web/NO2Average')
      .then((response) => {
        console.log('NO2 ' + response.data)
        this.setState({
          NO2Average: response.data.toFixed(0)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getPM10Average = () => {
    axios.get('/api/web/PM10Average')
      .then((response) => {
        console.log('PM10 ' + response.data)
        this.setState({
          PM10Average: response.data.toFixed(0)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getPM25Average = () => {
    axios.get('/api/web/PM25Average')
      .then((response) => {
        console.log('PM2.5 ' + response.data)
        this.setState({
          PM25Average: response.data.toFixed(0)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    return (
      <SidebarPageManager>
        <Route path={`${this.props.match.path}/details`} render={(props) =>
          <DetailsSubpage {...props} setRadius={this.props.setMapCurrentRadius} />
        } />
        <Route path={`${this.props.match.path}/`} render={() =>
          <SidebarPage title='Explore'>
            <Section title='24 Hour Averages'>
              <Card className='average' link={`${this.props.match.path}/averages/air`}>
                <IconAirPollution className='icon' />
                <div className='details'>
                  <h1>Air Pollution</h1>
                  <span className='value'>{this.state.airQualityIndex}</span>
                </div>
              </Card>
              <Card className='average' link={`${this.props.match.path}/averages/noise`}>
                <IconNoise className='icon' />
                <div className='details'>
                  <h1>Noise</h1>
                  <span className='value'>{this.state.noiseAverage} dBA</span>
                </div>
              </Card>
            </Section>
            <Section title='More Details'>
              <Card>
                <h1>Want to see more details?</h1>
                <h2>Click the map to view more detailed readings for a location.</h2>
              </Card>
            </Section>
          </SidebarPage>
        } />
      </SidebarPageManager>
    )
  }
}

ExplorePage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  mapState: PropTypes.object,
  setMapCurrentRadius: PropTypes.func
}
