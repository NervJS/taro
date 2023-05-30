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
  validators: {
    validateEnv, validateConfig, validateEslint, validatePackage, validateRecommend
  }
}
