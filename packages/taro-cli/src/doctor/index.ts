import {
  validateConfig,
  validateEnv,
  validateEslint,
  validatePackage,
  validateRecommend } from '@tarojs/plugin-doctor'

export default {
  validators: [
    () => {
      return validateEnv.call(this)
    },
    (args) => {
      return validateConfig.call(this, args.projectConfig, args.helper)
    },
    (args) => {
      return validatePackage.call(this, args.appPath, args.nodeModulesPath)
    },
    (args) => {
      return validateRecommend.call(this, args.appPath)
    },
    async (args) => {
      return await validateEslint.call(this, args.projectConfig, args.chalk)
    }
  ]
}
