import { getTestRule } from 'jest-preset-stylelint'
import taroRulesPlugin from './lib'

global.testRule = getTestRule({
  plugins: taroRulesPlugin,
  loadLint: () => Promise.resolve(require('stylelint').lint)
})
