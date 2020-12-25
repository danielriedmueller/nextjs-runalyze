const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public'
    },
    webpack: (config, { isServer }) => {
        config.plugins.push(
            new CopyWebpackPlugin(
                {
                    patterns: [
                        { from: path.join(__dirname, 'assets/pwa'), to: path.join(__dirname, 'public') },
                        { from: path.join(__dirname, 'assets/manifest.json'), to: path.join(__dirname, 'public/manifest.json') },
                        { from: path.join(__dirname, 'assets/favicon.ico'), to: path.join(__dirname, 'public/favicon.ico') }
                    ]
                }
            )
        );
        return config;
    }
})