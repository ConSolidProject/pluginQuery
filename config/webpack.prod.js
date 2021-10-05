const {merge} = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const packageJson = require('../package.json')
const commonConfig = require('./webpack.common')
const deps = packageJson.dependencies
const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: packageJson.domain
    },
    plugins: [
        new ModuleFederationPlugin({
            name: packageJson.name,
            filename: 'remoteEntry.js',
            exposes: {
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
              }
        })
    ]
}

module.exports = merge(commonConfig, prodConfig)