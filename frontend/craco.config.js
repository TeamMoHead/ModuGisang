const path = require('path');

module.exports = {
  webpack: {
    configure: webpackConfig => {
      webpackConfig.entry = {
        main: path.resolve(__dirname, 'src/index.js'),
        socketWorker: path.resolve(__dirname, 'src/workers/socketWorker.js'),
      };
      webpackConfig.output.filename = '[name].bundle.js';
      return webpackConfig;
    },
  },
};
