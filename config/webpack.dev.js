const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const packageJson = require('../package.json')
const commonConfig = require("./webpack.common");

const PORT = packageJson.port
const deps = packageJson.dependencies

const devConfig = {
  mode: "development",
  output: {
    publicPath: `http://localhost:${PORT}/`
  },
  devServer: {
    port: PORT,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  devtool: "source-map",
  plugins: [
    new ModuleFederationPlugin({
      name: packageJson.name,
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.js',
        './index': './src/bootstrap'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@material-ui/core": {
          singleton: true,
          requiredVersion: deps["@material-ui/core"],
        },
        "@material-ui/icons": {
          singleton: true,
          requiredVersion: deps["@material-ui/icons"],
        },
        events: {eager: true, requiredVersion: deps.events}
      },
      
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};


module.exports = merge(commonConfig, devConfig)