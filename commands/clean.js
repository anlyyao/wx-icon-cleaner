const fs = require('fs');
const path = require('path');
const WxIconCleaner = require('../lib/index');

module.exports = {
  command: 'clean',
  desc: 'Clean up unused icons based on the provided configuration',
  builder(yargs) {
    return yargs
      .option('config', {
        alias: 'c',
        description: 'Path to the configuration file',
        type: 'string',
        default: 'wx-icon-cleaner.config.js'
      })
      .option('output', {
        alias: 'o',
        description: 'Path to the output CSS file',
        type: 'string'
      });
  },

  handler(argv) {
    async function run() {
      try {
        // Resolve the absolute path of the configuration file
        const configFilePath = path.resolve(process.cwd(), argv.config);

        // Check if the configuration file exists
        if (!fs.existsSync(configFilePath)) {
          throw new Error(
            `Configuration file not found at ${configFilePath}. Please check the path.`
          );
        }

        // Load the configuration file
        delete require.cache[require.resolve(configFilePath)];
        const userConfig = require(configFilePath);

        // Validate that the loaded configuration is either an object or an array of objects
        if (!(typeof userConfig === 'object')) {
          throw new Error(
            'The configuration file must export an object or an array of objects.'
          );
        }

        // Convert single object to array if needed
        const configs = Array.isArray(userConfig) ? userConfig : [userConfig];

        // Initialize and execute the WxIconCleaner
        const iconCleaner = new WxIconCleaner(configs);
        await iconCleaner.iconCleaner();
      } catch (err) {
        console.error('An error occurred:', err.message);
        process.exit(1);
      }
    }

    run();
  }
};
