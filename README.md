# wx-icon-cleaner
A tool for cleaning unused icons from WeChat Mini Programs.

## 背景
微信原生小程序引入第三方 UI 组件库时，图标样式通常会被全量引入，造成大量图标样式冗余。wx-icon-cleaner 正是在此背景下诞生，一个用于清理实际未使用图标的工具。

## 使用
### 安装

```bash
npm i --save-dev wx-icon-cleaner
```

### 命令执行
```bash
# 在当前目录初始化配置文件，js/json
npx wx-icon-cleaner init
# or 在指定目录初始化配置文件
npx wx-icon-cleaner init ./some/directory

# 过滤未使用图标，默认读根目录下 wx-icon-cleaner.config.js/json 文件
npx wx-icon-cleaner --config ./icon-cleaner.config.js
```

### 配置文件
```js
// 项目根路径下创建 wx-icon-cleaner.config.js 配置文件
module.exports = {
  classPrefix: 't', // 仅处理 t-icon 开头的图标，非 t-icon 开头的图标默认保留。默认值 t
  inputFile: './miniprogram/miniprogram_npm/tdesign-miniprogram/icon/icon.wxss', // 目标文件相对路径路径
  outputFile: '' // 输出文件路径，若未提供，默认覆盖目标文件路径
  usedIcons: ['accessibility-filled', 'app'] // 已使用图标组
};
```

### 在 Node 中使用
```js
const WxIconCleaner = require('wx-icon-cleaner');
const config = require('./wx-icon-cleaner.config.js');

const iconCleaner = new WxIconCleaner(config);

iconCleaner
  .iconCleaner()
  .then(() => {
    console.log('Process completed successfully!');
  })
  .catch((error) => {
    console.error('An error occurred:', error.message);
  });
```

### 效果
#### 以 tdesign-miniprogram 为例，假如业务实际使用 60 个图标。源图标样式文件 98kb，wx-icon-cleaner 清理后，图标样式文件降低到 4kb）

```css
/* 最终目标样式文件进保留常规样式类和已使用图标类 */
@import '../common/style/index.wxss';

@font-face {
  font-family: t;
  src: url(https://tdesign.gtimg.com/icon/0.3.1/fonts/t.eot),url(https://tdesign.gtimg.com/icon/0.3.1/fonts/t.eot?#iefix) format('ded-opentype'),url(https://tdesign.gtimg.com/icon/0.3.1/fonts/t.woff) format('woff'),url(https://tdesign.gtimg.com/icon/0.3.1/fonts/t.ttf) format('truetype'),url(https://tdesign.gtimg.com/icon/0.3.1/fonts/t.svg) format('svg');
  font-weight: 400;
  font-style: normal;
}

.t-icon--image {
  width: 100%;
  height: 100%;
}

.t-icon__image {
  vertical-align: top;
  width: 100%;
  height: 100%;
}

.t-icon-base {
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  text-align: center;
  display: block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.t-icon {
  font-family: t!important;
}

.t-icon-accessibility-filled:before {
  content: '\E001';
}

.t-icon-app:before {
  content: '\E027';
}
...
```