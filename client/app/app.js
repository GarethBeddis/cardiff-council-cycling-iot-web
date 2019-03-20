// React
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

// Components
import Layout from './components/layout/layout'
import MapView from './components/map/map-view'
import Sidebar from './components/sidebar/sidebar'
import SidebarPageManager from './components/sidebar/sidebar-page-manager'
import ConfirmationModal from './components/modal/confirmation-modal'

// Pages
import ExplorePage from './pages/explore-page'
import ProfilePage from './pages/profile-page'
import HistoryPage from './pages/history-page'
import SearchPage from './pages/search-page'
import AveragesPage from './pages/explore-page/averages-page'
import SettingsPage from './pages/settings-page'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSidebar: true,
      showLogoutConfirmation: false,
      mapState: null
    }
  }

  hideSplash () {
    // Hide the splash screen
    // Ref: https://github.com/nguyenbathanh/react-loading-screen
    const loadingScreen = document.getElementById('splash-screen')
    loadingScreen.classList.add('fade-out')
    setTimeout(() => {
      loadingScreen.outerHTML = ''
    }, 200)
  }

  onMapLoad = () => {
    this.hideSplash()
  }

  onMapClick = (event) => {
    this.setState({
      showSidebar: true,
      mapState: { clickLocation: event.lngLat }
    })
  }

  toggleSidebar = (show) => {
    if (typeof show !== 'boolean') {
      this.setState({ showSidebar: !this.state.showSidebar })
    } else {
      this.setState({ showSidebar: show })
    }
  }

  logout = () => {
    window.location = '/'
  }

  toggleLogoutConfirmation = () => {
    this.setState({ showLogoutConfirmation: !this.state.showLogoutConfirmation })
  }

  render () {
    return (
      <Layout sidebarToggle={this.toggleSidebar} logout={this.toggleLogoutConfirmation} >
        <MapView
          onMapLoad={this.onMapLoad}
          onMapClick={this.onMapClick}
          sidebarToggle={this.toggleSidebar} />
        <Sidebar showSidebar={this.state.showSidebar}>
          <SidebarPageManager>
            <Redirect exact from={this.props.match.path} to='/app/explore' />
            <Route path={`${this.props.match.path}/explore`} render={(props) => <ExplorePage {...props} mapState={this.state.mapState} />} />
            <Route path={`${this.props.match.path}/profile`} render={(props) => <ProfilePage {...props} />} />
            <Route path={`${this.props.match.path}/history`} render={(props) => <HistoryPage {...props} />} />
            <Route path={`${this.props.match.path}/search`} render={(props) => <SearchPage {...props} />} />
          </SidebarPageManager>
        </Sidebar>
        <AveragesPage path={`${this.props.match.path}/explore/averages/:type`} />
        <SettingsPage path={`${this.props.match.path}/settings`} />
        <ConfirmationModal
          show={this.state.showLogoutConfirmation}
          close={this.toggleLogoutConfirmation}
          title='Logout'
          subheading='Are you sure you want to logout?'
          onNo={this.toggleLogoutConfirmation}
          onYes={this.logout}
          dangerYes />
      </Layout>
    )
  }
}

App.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}
