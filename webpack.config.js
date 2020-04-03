
module.exports = {
  entry: './lib/index.js',
  output: {
    path: require('path').join(__dirname, './public'),
    filename: 'app.js'
  }
};
