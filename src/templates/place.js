import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

class Place extends Component {
  render () {
    const {
      title
    } = this.props.data.contentfulPlace

    return (
      <div>
        <Helmet
          title={title}
          meta={[
            {name: 'description', content: `Les photos du voyage à ${title}`}
          ]}
        />
        <h1>{title}</h1>
      </div>
    )
  }
}

Place.propTypes = {
  data: PropTypes.object.isRequired
}

export const pageQuery = graphql`
    query place($id: String!){
        contentfulPlace(id: {eq: $id}) {
            id,
            slug,
            title
        }
    }
`

export default Place
