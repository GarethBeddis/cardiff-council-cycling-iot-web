// React
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// Components
import Layout from './components/layout/layout'
import Map from './components/map/map'
import Sidebar from './components/sidebar/sidebar'

// Pages
import ExplorePage from './pages/explore-page'
import ProfilePage from './pages/profile-page'
import HistoryPage from './pages/history-page'
import SettingsModal from './modals/settings-modal'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSidebar: true,
      showSettings: false
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleSettings = this.toggleSettings.bind(this)
  }

  toggleSidebar (show) {
    if (typeof show !== 'boolean') {
      this.setState({ showSidebar: !this.state.showSidebar })
    } else {
      this.setState({ showSidebar: show })
    }
  }

  toggleSettings () {
    this.setState({ showSettings: !this.state.showSettings })
  }

  render () {
    return (
      <Layout sidebarToggle={this.toggleSidebar} settingsToggle={this.toggleSettings} >
        <Map />
        <Sidebar showSidebar={this.state.showSidebar}>
          <Switch>
            <Redirect exact from='/app' to='/app/explore' />
            <Route path='/app/explore' render={(props) => <ExplorePage {...props} />} />
            <Route path='/app/profile' render={(props) => <ProfilePage {...props} />} />
            <Route path='/app/history' render={(props) => <HistoryPage {...props} />} />
          </Switch>
        </Sidebar>
        <SettingsModal show={this.state.showSettings} close={this.toggleSettings} />
      </Layout>
    )
  }
}
