// @ts-nocheck
import {
  validateEslint
} from '@tarojs/plugin-doctor'
import {
  validateConfig,
  validateEnv,
  validatePackage,
  validateRecommend
} from '@tarojs/plugin-doctor/js-binding'

export default {
  validators: [
    () => {
      return validateEnv.call(this)
    },
    (args) => {
      const configStr = JSON.stringify(args.projectConfig, (_, v) => {
        if (typeof v === 'function') {
          return '__function__'
        }
        return v
      })
      return validateConfig.call(this, configStr)
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
