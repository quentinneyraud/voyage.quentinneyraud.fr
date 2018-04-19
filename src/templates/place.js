import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Masonry from 'masonry-layout'

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

class Place extends Component {
  constructor () {
    super()

    this.onMediaClick = this.onMediaClick.bind(this)
  }

  onMediaClick (e) {
    console.log(e)
    TweenMax.to(e.currentTarget, 0.5, {
      width: '80vw',
      height: '80vh'
    })
  }

  componentDidMount () {
    const medias = Array.from(document.querySelectorAll('.media-container'))

    medias.forEach((media) => {
      media.addEventListener('click', this.onMediaClick)
    })
  }

  render () {
    const {
      title,
      gallery
    } = this.props.data.contentfulPlace

    const medias = gallery.map((galleryItem) => {
      return (galleryItem.file.contentType.split('/')[0] === 'image') ? (
        <div className="media-container">
          <div className="img-container">
            <Img backgroundColor={true} sizes={galleryItem.sizes}/>
          </div>
        </div>
      ) : (
        <div className="media-container">
          <video controls src={galleryItem.file.url} key={galleryItem.id}/>
        </div>
      )
    })

    return (
      <main className="page-place">
        <Helmet
          title={title}
          meta={[
            {name: 'description', content: `Les photos du voyage à ${title}`}
          ]}
        />
        <div className="clear-area"/>
        <h1>{title}</h1>
        <div className="grid">
          {medias}
        </div>
      </main>
    )
  }
}

Place.propTypes = {
  data: PropTypes.object.isRequired
}

export const pageQuery = graphql`
    query place($id: String!){
        contentfulPlace(id: {eq: $id}) {
            title,
            gallery {
                id,
                sizes (maxWidth: 1200) {
        base64
        aspectRatio
        src
        srcSet
        srcWebp
        srcSetWebp
        sizes
      } 
                file {
                    contentType,
                    url
                }
            }
        }
    }
`

export default Place
