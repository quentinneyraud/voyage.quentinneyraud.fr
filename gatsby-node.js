const path = require(`path`)
const slash = require(`slash`)

exports.modifyWebpackConfig = ({config, stage}) => {
  config.merge({
    resolve: {
      alias: {
        'TweenLite': 'gsap/umd/TweenLite'
      }
    }
  });

  if (stage === "build-html") {
    config.loader("null", {
      test: /(mapbox-gl)\.js$/,
      loader: "null-loader",
    });
  }

  return config;
};

exports.createPages = ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators
  return new Promise((resolve, reject) => {
    resolve(graphql(
      `
        {
          allContentfulPlace (sort: {
          fields: [start],
          order: ASC
        })  {
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
        console.log('#############')
        result.data.allContentfulPlace.edges.forEach((edge, index) => {
          const nextId = (index === result.data.allContentfulPlace.edges.length - 1) ? null : result.data.allContentfulPlace.edges[index + 1].node.id
          const prevId = (index === 0) ? null : result.data.allContentfulPlace.edges[index - 1].node.id

          console.log('Create page with slug:' + edge.node.slug)
          createPage({
            path: edge.node.slug,
            component: slash(productTemplate),
            context: {
              id: edge.node.id,
              nextId,
              prevId
            }
          })
        })
        console.log('#############')

        return
      }))
  })
}


// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;
  return new Promise(resolve => {
    const oldPage = Object.assign({}, page);
    // Remove trailing slash unless page is /
    page.path = (_path => (_path === `/` ? _path : _path.replace(/\/$/, ``)))(page.path);
    if (page.path !== oldPage.path) {
      // Replace new page with old page
      deletePage(oldPage);
      createPage(page);
    }
    resolve();
  });
};

