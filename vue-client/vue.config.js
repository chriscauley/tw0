const path = require('path')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        tw: path.resolve(__dirname, '../tw'),
      },
    },
  },
}
