import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Panel from '../components/Panel'
import { TransitionGroup } from 'react-transition-group'
import thx from '../classes/ThanksConsole'

import '../styles/main.scss'

class Layout extends Component {
  componentDidMount () {
    this.thanksLibraries()
  }

  thanksLibraries () {
/*
    thx({
      developers: [{
        name: 'Quentin Neyraud',
        url: 'https://twitter.com/quentin_neyraud'
      }],
      libraries: [{
        name: 'Mapbox',
        url: 'https://www.mapbox.com'
      }, {
        name: 'Gatsby',
        url: 'https://www.gatsbyjs.org'
      }, {
        name: 'GSAP',
        url: 'https://greensock.com/gsap'
      }, {
        name: 'React',
        url: 'https://reactjs.org'
      }, {
        name: 'Redux',
        url: 'https://redux.js.org'
      }]
    })*/
  }

  render () {
    const { data, children } = this.props

    return (
      <div>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {name: 'description', content: 'Sample'},
            {name: 'keywords', content: 'sample, something'},
          ]}
        />
        <Panel places={data.allContentfulPlace.edges}/>
        <div id="menu-trigger"/>
        <TransitionGroup>
          {children()}
        </TransitionGroup>
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object.isRequired
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPlace (sort: {
          fields: [start],
          order: ASC
        }) {
          edges{
            node{
              title
              slug
              location {
                lon
                lat
              }
            }
          }
      }
  } 
`
