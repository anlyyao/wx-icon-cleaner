const fs = require('fs');
const path = require('path');
const parseCss = require('css-parse');
const stringifyCss = require('css-stringify');

const { CLASS_PREFIX } = require('../config/constants');

class WxIconCleaner {
  constructor(options) {
    this.options = Array.isArray(options) ? options : [options];
    this.validateOptions();
  }

  validateOptions() {
    this.options.forEach((option) => {
      if (!option.inputFile) {
        throw new Error('inputFile is required in each configuration entry.');
      }
      if (!option.classPrefix) {
        throw new Error('classPrefix is required in each configuration entry.');
      }
      if (!option.usedIcons || !Array.isArray(option.usedIcons)) {
        throw new Error('usedIcons must be an array in each configuration entry.');
      }
    });
  }

  readCSSFile(filePath) {
    try {
      return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
    } catch (error) {
      throw new Error(`Failed to read CSS file at ${filePath}: ${error.message}`);
    }
  }

  writeCSSFile(filePath, content) {
    try {
      fs.writeFileSync(path.resolve(process.cwd(), filePath), content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write CSS file at ${filePath}: ${error.message}`);
    }
  }

  filterUnusedIconRules(ast, usedIcons, classPrefix) {
    const regex1 = new RegExp(`^\\.${classPrefix}-icon.*?:before$`);
    const regex2 = new RegExp(`${classPrefix}-icon-(.*?)\\:before`);

    ast.stylesheet.rules = ast.stylesheet.rules.filter((rule) => {
      // 保留 非规则类型 或 非 .t-icon 开头，:before 结尾的选择器
      if (!rule.selectors || !regex1.test(rule.selectors?.[0])) {
        return true;
      }

      // 提取图标名称
      const iconName = regex2.exec(rule.selectors?.[0])[1];

      // 图标在已用图标组中则保留，否则丢弃
      return usedIcons.includes(`${iconName}`);
    });
  }

  async iconCleaner() {
    for (const option of this.options) {
      try {
        const cssContent = this.readCSSFile(option.inputFile);
        const parsedAst = parseCss(cssContent);

        this.filterUnusedIconRules(
          parsedAst,
          option.usedIcons,
          option.classPrefix || CLASS_PREFIX
        );

        const cleanedCssString = stringifyCss(parsedAst);

        // Write back to the same file or create a new one
        this.writeCSSFile(option.outputFile || option.inputFile, cleanedCssString);

        console.log(
          `${option.usedIcons.length} icons used. Optimized and saved CSS to ${
            option.outputFile || option.inputFile
          }`
        );
      } catch (err) {
        console.error(
          `An error occurred while processing ${option.inputFile}:`,
          err.message
        );
      }
    }
  }
}

module.exports = WxIconCleaner;
