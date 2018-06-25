import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Link from 'gatsby-link'
import Scrollbar from 'smooth-scrollbar'
if (typeof window !== `undefined`) {
  const module = require("gsap/umd/TweenMax");
}

class Place extends Component {
  constructor (props) {
    super(props)

    this.onMediaClick = this.onMediaClick.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  onMediaClick (e) {
    TweenMax.to(e.currentTarget, 0.5, {
      width: '80vw',
      height: '80vh'
    })
  }

  componentDidMount () {
    // const medias = Array.from(document.querySelectorAll('.media-container'))
    //
    // medias.forEach((media) => {
    //   media.addEventListener('click', this.onMediaClick)
    // })

    /*document.getElementById('next-link').addEventListener('click', (e) => {
      e.preventDefault()
      let pathname = e.currentTarget.pathname
      TweenMax.to('#line', 1, {
        scaleY: 0,
        onComplete: () => {
          this.props.history.push(pathname)
        }
      })

    })*/
    let sc = Scrollbar.init(document.querySelectorAll('.page-place')[0]);
    sc.addListener(this.onScroll)
  }

  onScroll ({offset, limit}) {
    let scrolled = (offset.y / limit.y) * 100
    TweenMax.to('#line', 0.05, {
      scaleY: scrolled / 100
    })
  }

  render () {
    const {
      title,
      gallery
    } = this.props.data.current

    let medias = []

    if (!gallery || gallery.length === 0) {
      medias = (<h1>pas de gallerie</h1>)
    } else {
      medias = gallery.map((galleryItem, key) => {
        return (galleryItem.file.contentType.split('/')[0] === 'image') ? (
          <div className="media-container" key={key}>
            <div className="description">Une place à Berlin</div>
            <Img sizes={galleryItem.sizes} /*imgStyle={{objectFit:'contain', objectPosition:'0 0'}} style={{maxHeight:'90vh'}}*//>
          </div>
        ) : (
          <div className="media-container" key={key}>
            <video controls src={galleryItem.file.url}/>
          </div>
        )
      })
    }

    return (
      <main className="page-place">
        <Helmet
          title={title}
          meta={[
            {name: 'description', content: `Les photos du voyage à ${title}`}
          ]}
        />
        <div className="clear-area"/>
        <div id="line"/>
        <h1>{title}</h1>
        <div className="grid">
          {medias}
        </div>
        {this.props.data.next &&
          <Link id="next-link" to={this.props.data.next.slug}>{this.props.data.next.title}</Link>
        }
        <div className="clear-area"/>
      </main>
    )
  }
}

Place.propTypes = {
  data: PropTypes.object.isRequired
}

export const pageQuery = graphql`
    query place($id: String!, $nextId: String, $prevId: String) {
  current: contentfulPlace(id: {eq: $id}) {
    title
    gallery {
      id
      description
      sizes (maxWidth: 800, quality: 100) {
        base64
        aspectRatio
        sizes
        src
        srcSet
        srcWebp
        srcSetWebp
      }
      file {
        contentType
        url
      }
    }
  }
  next: contentfulPlace(id: {eq: $nextId}) {
    title
    slug
  }
  previous: contentfulPlace(id: {eq: $prevId}) {
    title
    slug
  }
}
`

export default Place
