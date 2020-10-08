const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve('./src/index.js'),

    module: {
        rules: [
            {
                test: /\.(glb|gltf)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            // injects bundle.js to our new index.html
            inject: true,
            // copies the content of the existing index.html to the new ./builds index.html
            template: path.resolve('./index.html')
        })
    ],

    // needed to load ammo's npm
    node: {
        fs: 'empty'
    }
};
