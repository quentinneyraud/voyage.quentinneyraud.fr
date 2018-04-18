const path = require(`path`)
const slash = require(`slash`)

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators
    return new Promise((resolve, reject) => {
        resolve(graphql(
            `
        {
          allContentfulPlace(limit: 1000) {
            edges {
              node {
                id,
                slug
              }
            }
          }
        }
      `
        )
            .then(result => {
                if (result.errors) {
                    reject(result.errors)
                }

                const productTemplate = path.resolve(`./src/templates/place.js`)
                result.data.allContentfulPlace.edges.forEach(edge => {
                    console.log('create page slug:' + edge.node.slug)
                    createPage({
                        path: edge.node.slug,
                        component: slash(productTemplate),
                        context: {
                            id: edge.node.id,
                        }
                    })
                })

                return
            }))
    })
}