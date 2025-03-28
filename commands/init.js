const fs = require('fs');
const path = require('path');

/**
 * Function to initialize a default configuration file.
 */
function initConfig(outputDir) {
  const jsConfigFileName = 'wx-icon-cleaner.config.js';
  const jsonConfigFileName = 'wx-icon-cleaner.config.json';

  const jsConfigFilePath = path.join(outputDir, jsConfigFileName);
  const jsonConfigFilePath = path.join(outputDir, jsonConfigFileName);

  // Check if either config file already exists
  if (fs.existsSync(jsConfigFilePath)) {
    console.warn(
      `Configuration file already exists at ${jsConfigFilePath}. Skipping initialization.`
    );
    return;
  }

  if (fs.existsSync(jsonConfigFilePath)) {
    console.warn(
      `Configuration file already exists at ${jsonConfigFilePath}. Skipping initialization.`
    );
    return;
  }

  // Define the default configuration content
  const defaultJsConfig = `
    module.exports = {
    classPrefix: 't', // Prefix for icon classes (e.g., 't' or 'test')
    inputFile: '', // Path to your input CSS file
    outputFile: '', // Optional: Path to your output CSS file
    usedIcons: [] // List of used icon names
    };`.trim();

  const defaultJsonConfig = JSON.stringify(
    {
      classPrefix: 't', // Prefix for icon classes (e.g., 't' or 'test')
      inputFile: '', // Path to your input CSS file
      outputFile: '', // Optional: Path to your output CSS file
      usedIcons: [] // List of used icon names
    },
    null,
    2
  );

  // Ask the user which format they prefer
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question(
    'Do you want to generate a JavaScript (.js) or JSON (.json) configuration file? (default: js): ',
    (answer) => {
      answer = answer.toLowerCase().trim();

      if (answer === '' || answer === 'js') {
        fs.writeFile(jsConfigFilePath, defaultJsConfig, (err) => {
          if (err) {
            console.error(
              `Failed to create configuration file at ${jsConfigFilePath}:`,
              err.message
            );
            process.exit(1);
          }
          console.log(`Default configuration file created at ${jsConfigFilePath}`);
        });
      } else if (answer === 'json') {
        fs.writeFile(jsonConfigFilePath, defaultJsonConfig, (err) => {
          if (err) {
            console.error(
              `Failed to create configuration file at ${jsonConfigFilePath}:`,
              err.message
            );
            process.exit(1);
          }
          console.log(`Default configuration file created at ${jsonConfigFilePath}`);
        });
      } else {
        console.error('Invalid choice. Please choose between "js" or "json".');
        process.exit(1);
      }

      readline.close();
    }
  );
}

module.exports = {
  command: 'init [dir]',
  desc: 'Initialize a default configuration file',
  builder(yargs) {
    return yargs.positional('dir', {
      describe: 'Directory where the configuration file will be created',
      type: 'string',
      demandOption: false,
      defaultDescription: 'Current working directory'
    });
  },
  handler(argv) {
    // Determine the output directory
    const outputDir = argv.dir ? path.resolve(process.cwd(), argv.dir) : process.cwd();

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      console.error(`Specified directory "${outputDir}" does not exist.`);
      process.exit(1);
    }

    initConfig(outputDir);
  }
};
