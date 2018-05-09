import React, { Component, createElement } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import getStore from './src/redux/createStore'

class ReplaceComponentRenderer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillLeave () {
    console.log('leave')
  }

  render() {
    return (
      <TransitionGroup component="span">
        <this.props.pageResources.component {...this.props} {...this.props.pageResources.json}/>
      </TransitionGroup>
    )
  }
}

exports.replaceComponentRenderer = ({ props, loader }) => {
  if (props.layout) {
    return undefined
  }
  return createElement(ReplaceComponentRenderer, { ...props, loader })
}

exports.replaceRouterComponent = ({ history }) => {
  const store = getStore()

  return ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  )
}
