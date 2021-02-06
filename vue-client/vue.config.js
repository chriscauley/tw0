const path = require('path')

const devServer = {
  host: 'tw.localhost',
  port: 8069,
  historyApiFallback: true,
}

module.exports = {
  lintOnSave: false,
  devServer,
  configureWebpack: {
    resolve: {
      alias: {
        tw: path.resolve(__dirname, '../tw'),
      },
    },
  },
}
