import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import axios from 'axios'

import SidebarPageManager from '../components/sidebar/sidebar-page-manager'
import SidebarPage from '../components/sidebar/sidebar-page'
import Section from '../components/common/section'
import Card from '../components/common/card'

import IconAirPollution from './explore-page/icons/air-pollution.svg'
import IconNoise from './explore-page/icons/noise.svg'
import IconBike from './settings-page/icons/bike.svg'

export default class ProfilePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      journeys: []
    }
  }

  componentWillMount () {
    // testing the functions
    this.getJourneys(1)
    this.getTotalAverages(1)
    this.getJourneyMonth(1)
    this.getJourneyDay(1)
    this.getJourneyStartTime(1)
    this.getJourneyEndTime(1)
    this.getJourneyDistance(1)
  }

  fetchData = (data) => {
    return data
  }

  getJourneys = (userId) => {
    axios.get('/api/web/' + userId + '/journeys')
      .then((response) => {
        this.setState({
          journeys: response.data
        })
        console.log(this.state.journeys)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getTotalAverages = (userId) => {
    axios.get('/api/web/' + userId + '/measurements')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Statistics
  getTotalDistanceTravelled = (journey) => {}

  // Trips
  getJourneyMonth = (journeyId) => {
    return axios.get('/api/web/journeys/' + journeyId + '/month')
      .then((response) => {
        console.log('month: ' + response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getJourneyDay = (journeyId) => {
    axios.get('/api/web/journeys/' + journeyId + '/day')
      .then((response) => {
        console.log('day: ' + response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getJourneyStartTime = (journeyId) => {
    axios.get('/api/web/journeys/' + journeyId + '/startTime')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getJourneyEndTime = (journeyId) => {
    axios.get('/api/web/journeys/' + journeyId + '/endTime')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getJourneyDistance = (journeyId) => {
    axios.get('/api/web/journeys/' + journeyId + '/distance')
      .then((response) => {
        console.log('Distance' + response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getJourneyAirAverage = (journey) => {
    let userId = journey.userId
    let journeyId = journey.journeyId
    // Get journey array
    axios.get('api/web' + userId + 'journeys' / journeyId)
      .then((response) => {
        // TODO: Average air here
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    return (
      <SidebarPageManager>
        <Route path={`${this.props.match.path}/subpage`} render={() =>
          <SidebarPage title='Subpage Example' canGoBack>
            <Section title='About'>
              <Card>
                <h1>This is an Example Subpage</h1>
                <h2>Click the back button to go back to the explore page.</h2>
              </Card>
            </Section>
          </SidebarPage>
        } />
        <Route path={`${this.props.match.path}/`} render={() =>
          <SidebarPage title='Profile'>
            <Section title='Your Statistics'>
              <Card className='average' link={``}>
                <IconBike className='icon' />
                <div className='details'>
                  <h1>Total Distance Travelled</h1>
                  <span className='value'>23 Miles</span>
                </div>
              </Card>
              <Card className='average' link={``}>
                <IconAirPollution className='icon' />
                <div className='details'>
                  <h1>Average Air Pollution Exposure</h1>
                  <span className='value'>Moderate</span>
                </div>
              </Card>
              <Card className='average' link={``}>
                <IconNoise className='icon' />
                <div className='details'>
                  <h1>Average Noise Pollution Exposure</h1>
                  <span className='value'>25 dBA</span>
                </div>
              </Card>
            </Section>
            <Section title='Your Trips'>
              {this.state.journeys.map((journey, i) =>
                <Card className='average' link={``} key={i}>
                  <div className='date'>
                    <h1>{this.getJourneyMonth(i + 1)}</h1>
                    <span>{this.getJourneyDay(i + 1)}</span>
                  </div>
                  <div className='details'>
                    <h1>9:35 - 11:58</h1>
                    <span className='value'>5 Miles</span>
                  </div>
                </Card>
              )}
            </Section>
          </SidebarPage>
        } />
      </SidebarPageManager>
    )
  }
}

ProfilePage.propTypes = {
  match: PropTypes.object
}
