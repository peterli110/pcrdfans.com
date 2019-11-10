const withPlugins = require('next-compose-plugins');

const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
//const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
//const withLess = require('./config/customizeWithLessPlugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const path = require('path');
const {
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const themeVariables = require('./theme/theme.config')();
const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');


// Where your antd-custom.less file lives
// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
// );

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  // eslint-disable-next-line node/no-deprecated-api
  require.extensions['.less'] = file => {};
}

const obfuscatorOptions = {
  compact: true,
  stringArray: true,
  stringArrayEncoding: true,
  stringArrayThreshold: 1,
}

module.exports = withPlugins(
  [
    [withTypescript],
    /*
    [withCSS, {
      cssModules: true,
      cssLoaderOptions: {
        localIdentName: '[path]___[local]___[hash:base64:5]',
      },
      [PHASE_PRODUCTION_BUILD]: {
        cssLoaderOptions: {
          localIdentName: '[hash:base64:8]',
        },
      },
    }],
    [
      withLess,
      {
        include: [
          //path.resolve(__dirname, 'node_modules/antd/lib/style/themes/default.less'),
          // TODO: a bug with '/'
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'pages'),
        ],
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables, // make your antd custom effective
        },
      },
    ],
    */
    [
      withLess,
      {
        include: [
          path.resolve(__dirname,'node_modules'),
          path.resolve(__dirname, 'themes'),
          path.resolve(__dirname, 'src')
        ],
        cssModules: false,
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables, // make your antd custom effective
        },
      },
    ],
    //[withSass],
    [withBundleAnalyzer],
  ],
  {
    distDir: process.env.NODE_ENV === 'production' ? 'build' : '.next',
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: './analyze/server.html',
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: './analyze/client.html',
      },
    },
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      /*
      config.node = {
        fs: 'empty',
      };
      // Added aliases

      config.resolve.alias = {
        '@root': path.join(__dirname),
        themes: path.resolve(__dirname, 'themes/'),
      };
      */
      if (config.mode === 'production') {
        if (Array.isArray(config.optimization.minimizer)) {
          config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
        }
        
        config.plugins.push(
          new JavaScriptObfuscator (obfuscatorOptions, ['bundles/**/**.js'])
        )
        config.plugins.push(
          new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/)
        )
        
        config.plugins.push(
          new MomentTimezoneDataPlugin({
            matchZones: "Asia/Shanghai",
          }),
        )

      }
      return config;
    },
  }
);