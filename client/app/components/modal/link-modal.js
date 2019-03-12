import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Modal from './modal'

class LinkModal extends React.Component {
  getClassName = () => {
    if (this.props.className) {
      return 'modal ' + this.props.className
    } else {
      return 'modal'
    }
  }

  close = () => {
    if (this.props.history.length > 1) {
      this.props.history.goBack()
    } else {
      this.props.history.push(this.props.match.path)
    }
  }

  render () {
    console.log(this.props)
    return (
      <div className={this.getClassName()}>
        <TransitionGroup>
          <CSSTransition
            key={this.props.location.key}
            classNames='animation'
            timeout={300}
            unmountOnExit>
            <Switch location={this.props.location}>
              <Route path={this.props.path}>
                <Modal title={this.props.title} close={this.close}>
                  {this.props.children}
                </Modal>
              </Route>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    )
  }
}

LinkModal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
  children: PropTypes.node,
  history: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object
}

// Wrapper function to wrap the component in a Route.
// This gives us access to React Router features like history.
export default function Wrapper (props) {
  return (
    <Route render={(routerProps) => (
      <LinkModal {...props} {...routerProps} />
    )} />
  )
}