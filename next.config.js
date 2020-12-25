const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public'
    }
})