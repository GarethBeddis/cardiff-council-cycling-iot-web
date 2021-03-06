import React from 'react'
import PropTypes from 'prop-types'

import BottomNavLinkBtn from './bottom-nav-link-btn'

import IconMap from './icons/map.svg'
import IconMapGradient from './icons/map-gradient.svg'
import IconProfile from './icons/profile.svg'
import IconProfileGradient from './icons/profile-gradient.svg'
import IconHistory from './icons/history.svg'
import IconHistoryGradient from './icons/history-gradient.svg'

export default class BottomNavBar extends React.Component {
  render () {
    return (
      <div className='bottom-nav-bar'>
        <BottomNavLinkBtn link='/app/explore' name='Explore' icon={IconMap} iconGradient={IconMapGradient} onClick={() => { this.props.sidebarToggle(true) }} />
        <BottomNavLinkBtn link='/app/profile' name='Profile' icon={IconProfile} iconGradient={IconProfileGradient} onClick={() => { this.props.sidebarToggle(true) }} />
        <BottomNavLinkBtn link='/app/history' name='History' icon={IconHistory} iconGradient={IconHistoryGradient} onClick={() => { this.props.sidebarToggle(true) }} />
      </div>
    )
  }
}

BottomNavBar.propTypes = {
  sidebarToggle: PropTypes.func
}
