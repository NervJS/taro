import { getTestRule } from 'jest-preset-stylelint'

import taroRulesPlugin from './src/index.ts'

global.testRule = getTestRule({
  plugins: taroRulesPlugin,
  // loadLint: () => Promise.resolve(require('stylelint').lint)
})
