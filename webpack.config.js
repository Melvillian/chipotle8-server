
module.exports = {
    entry: './lib/index.js',
    output: {
      path: require('path').join(__dirname, './dist'),
      filename: 'bundle.js'
    },
    mode: 'development'
  };