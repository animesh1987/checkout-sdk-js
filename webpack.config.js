const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

const { babelLoaderRules, getBaseConfig, libraryEntries, libraryName } = require('./webpack-common.config');

const outputPath = path.join(__dirname, 'dist');

async function getUmdConfig(options, argv) {
    const baseConfig = await getBaseConfig(options, argv);

    return {
        ...baseConfig,
        name: 'umd',
        entry: libraryEntries,
        output: {
            filename: '[name].umd.js',
            library: libraryName,
            libraryTarget: 'umd',
            path: outputPath,
        },
        module: {
            rules: [
                ...babelLoaderRules,
                ...baseConfig.module.rules,
            ],
        },
    };
}

async function getCjsConfig(options, argv) {
    const baseConfig = await getBaseConfig(options, argv);

    return {
        ...baseConfig,
        name: 'cjs',
        entry: libraryEntries,
        externals: [
            nodeExternals()
        ],
        output: {
            filename: '[name].js',
            libraryTarget: 'commonjs2',
            path: outputPath,
        },
        plugins: [
            ...baseConfig.plugins,
            new DefinePlugin({
                'process.env.NODE_ENV': 'process.env.NODE_ENV',
                // 'process.env.NODE_DEBUG': false,
            }),
        ],
    };
}

async function getConfigs(options, argv) {
    return [
        await getCjsConfig(options, argv),
        await getUmdConfig(options, argv),
    ];
}

module.exports = getConfigs;
module.exports.parallelism = 2;


// const el = document.createElement('script'); el.src= 'https://localhost:5000/v1/checkout-sdk-cc34eba7.js'; document.head.appendChild(el);

// const el = document.createElement('script'); el.src= 'https://checkout-sdk.integration.zone/v1/checkout-sdk-b2dfe62c.js'; document.head.appendChild(el);