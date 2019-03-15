import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

export default class NavbarLinkBtn extends React.Component {
  render () {
    return (
      <NavLink to={this.props.link} className='link-btn' name={this.props.name} onClick={this.props.onClick}>
        <div className='selection-indicator' />
        <div className='container'>
          <div className='hover-circle centered' />
          <this.props.icon className='icon centered' />
          <this.props.iconGradient className='icon gradient centered' />
        </div>
      </NavLink>
    )
  }
}

NavbarLinkBtn.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func
}
