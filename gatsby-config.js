module.exports = {
  siteMetadata: {
    title: 'Mon voyage',
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: `img`,
        path: `${__dirname}/src/img/`
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `7zkhlv39xda3`,
        accessToken: `2e64abd1f7b49def67aff0ed9a90379469f87348a9538a7af43c04f6beb7024a`,
      },
    },
  ],
}
