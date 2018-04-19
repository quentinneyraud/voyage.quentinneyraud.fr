module.exports = {
  siteMetadata: {
    title: 'Mon voyage',
  },
  plugins: [
      'gatsby-plugin-sass',
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
