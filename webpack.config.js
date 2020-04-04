module.exports = {
  entry: "./lib/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: require("path").join(__dirname, "./dist"),
    filename: "app.js",
  },
};
