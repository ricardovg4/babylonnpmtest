const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const path = require('path');

module.exports = merge(config, {
    output: {
        path: path.resolve('./build'),
        filename: 'bundle.js'
    }
});
