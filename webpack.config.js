let webpack = require("webpack");
let path = require("path");
module.exports = {
  entry: "./frontend/lib/index.ts",
  output: {
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules"],
  },
  mode: "development",
  devtool: "inline-source-map",
};
