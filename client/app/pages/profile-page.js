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
import IconBike from './profile-page/icons/bike.svg'
import Journey from './profile-page/journey-card'
import JourneySubpage from './profile-page/journey-subpage'

export default class ProfilePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      journeys: [],
      totalDistance: 0,
      currentDistance: 0,
      arrayDistance: [],
      noiseAverage: 0,
      no2Average: 0,
      pm10Average: 0,
      pm25Average: 0
    }
  }

  componentWillMount () {
    // Functions to get data to pass onto the state
    this.props.setData()
    this.getJourneys().then((response) => {
      this.getTotalDistanceTravelled()
    })
    this.getTotalAverages().then(() => {
      this.props.getAirQualityIndex(this.state.no2Average, this.state.pm25Average, this.state.pm10Average, true)
    })
  }

  // Statistics
  getJourneys = (userId) => {
    return axios.get('/api/web/user/journeys')
      .then((response) => {
        this.setState({
          journeys: response.data
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getTotalAverages = (userId) => {
    return axios.get('/api/web/user/readings/averages')
      .then((response) => {
        this.setState({
          noiseAverage: response.data.dBA.toFixed(0),
          no2Average: response.data.NO2.toFixed(0),
          pm10Average: response.data.PM10.toFixed(0),
          pm25Average: response.data.PM25.toFixed(0)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getTotalDistanceTravelled = (response) => {
    this.state.journeys.forEach((journey) => {
      this.getJourneyDistance(journey.id).then((response) => {
        var listDistance = this.state.arrayDistance
        listDistance.push(this.state.currentDistance)
        var totalDistance = this.state.totalDistance + this.state.currentDistance
        this.setState({
          totalDistance: totalDistance,
          arrayDistance: listDistance
        })
      })
    })
  }

  // Trips
  checkLeadingZero = (date) => ((date.toString().length === 1) ? '0' : '') + date.toString()

  getJourneyMonth = (journey) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']
    let month = months[new Date(journey.startTime).getMonth()]
    return month
  }

  getJourneyDay = (journey) => {
    return this.checkLeadingZero(new Date(journey.startTime).getDate())
  }

  getJourneyStartTime = (journey) => {
    let hours = this.checkLeadingZero(new Date(journey.startTime).getHours())
    let minutes = this.checkLeadingZero(new Date(journey.startTime).getMinutes())
    return (hours + ':' + minutes)
  }

  getJourneyEndTime = (journey) => {
    let hours = this.checkLeadingZero(new Date(journey.endTime).getHours())
    let minutes = this.checkLeadingZero(new Date(journey.endTime).getMinutes())
    return (hours + ':' + minutes)
  }

  getJourneyDistance = (journeyId) => {
    return axios.get('/api/web/journeys/' + journeyId + '/distance')
      .then((response) => {
        this.setState({
          currentDistance: response.data
          // arrayDistance: this.arrayDistance.push(response.data)
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
          <DetailsSubpage {...props}
            setRadius={this.props.setMapCurrentRadius}
            circleAverages={this.props.circleAverages}
            airQualityIndexSub={this.props.airQualityIndexSub}
            getAirQualityIndex={this.props.getAirQualityIndex}
          />
        } />
        <Route path={`${this.props.match.path}/journey`} render={() =>
          <JourneySubpage
            title='Get date here'
            airQualityIndex={this.props.airQualityIndexSub}
            getAirQualityIndex={this.props.getAirQualityIndex}
            setJourneyMap={this.props.setJourneyMap}
          />
        } />
        <Route path={`${this.props.match.path}/`} render={() =>
          <SidebarPage title='Profile'>
            <Section title='Your Statistics'>
              <Card className='average' link={``}>
                <IconBike className='icon' />
                <div className='details'>
                  <h1>Total Distance Travelled</h1>
                  <span className='value'>{this.state.totalDistance.toFixed(1)} Miles</span>
                </div>
              </Card>
              <Card link={`${this.props.match.path}/averages/air`}>
                <div className='average'>
                  <IconAirPollution className='icon' />
                  <div className='details'>
                    <h1>Average Air Pollution Exposure</h1>
                    <span className='value'>{this.props.airQualityIndexMain}</span>
                  </div>
                </div>
                <div className='pill-container'>
                  <div className='pill'>
                    <h2>NO2</h2>
                    <span>{this.state.no2Average} µg/m³</span>
                  </div>
                  <div className='pill'>
                    <h2>PM2.5</h2>
                    <span>{this.state.pm25Average} µg/m³</span>
                  </div>
                  <div className='pill'>
                    <h2>PM10</h2>
                    <span>{this.state.pm10Average} µg/m³</span>
                  </div>
                </div>
              </Card>
              <Card className='average' link={`${this.props.match.path}/averages/noise`}>
                <IconNoise className='icon' />
                <div className='details'>
                  <h1>Average Noise Pollution Exposure</h1>
                  <span className='value'>{this.state.noiseAverage} dB</span>
                </div>
              </Card>
            </Section>
            <Section title='Your Trips'>
              {this.state.journeys.map((journey, i) =>
                <Journey
                  key={i}
                  link={`${this.props.match.path}/journey/` + journey.id}
                  day={this.getJourneyDay(journey)}
                  month={this.getJourneyMonth(journey)}
                  startTime={this.getJourneyStartTime(journey)}
                  endTime={this.getJourneyEndTime(journey)}
                  distanceTravelled={this.state.arrayDistance[i]}
                />
              )}
            </Section>
          </SidebarPage>
        } />
      </SidebarPageManager>
    )
  }
}

ProfilePage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  mapState: PropTypes.object,
  setMapCurrentRadius: PropTypes.func,
  getCircleAverage: PropTypes.func,
  getAirQualityIndex: PropTypes.func,
  airQualityIndexMain: PropTypes.string,
  airQualityIndexSub: PropTypes.string,
  circleAverages: PropTypes.object,
  setData: PropTypes.func,
  setJourneyMap: PropTypes.func
}
