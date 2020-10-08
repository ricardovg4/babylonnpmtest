const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    // needed to load ammo's npm
    node: {
        fs: 'empty'
    },

    entry: path.resolve('./src/index.js'),

    plugins: [
        new HtmlWebpackPlugin({
            // injects bundle.js to our new index.html
            inject: true,
            // copies the content of the existing index.html to the new ./builds index.html
            template: path.resolve('./index.html')
        })
    ]
};
