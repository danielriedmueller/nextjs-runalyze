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
                        { from: path.join(__dirname, 'assets/icons'), to: path.join(__dirname, 'public/icons') },
                        { from: path.join(__dirname, 'manifest.json'), to: path.join(__dirname, 'public/manifest.json') }
                    ]
                }
            )
        );
        return config;
    }
})