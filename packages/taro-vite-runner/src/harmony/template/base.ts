import { prettyPrintJson } from '../../utils'

import type { ViteHarmonyBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

export default class BaseParser {
  prettyPrintJson = prettyPrintJson
  transArr2Str (array: unknown[], prefixSpace = 0, connector = '\n') {
    return array
      .filter(e => typeof e === 'string' || (e instanceof Array && e.length > 0))
      .reduce<string>((p, e) => `${p ? `${p}${connector}` : ''}${
      e instanceof Array ? this.transArr2Str(e, prefixSpace, connector) : `${' '.repeat(prefixSpace)}${e}`
    }`.replace(/(\x20*$)/g, ''), '')
  }

  getPxTransformConfig (buildConfig: ViteHarmonyBuildConfig) {
    const pxTransformOption = buildConfig.postcss?.pxtransform || {}
    const pxTransformConfig = pxTransformOption.config || {}
    pxTransformConfig.designWidth = buildConfig.designWidth
    pxTransformConfig.deviceRatio = buildConfig.deviceRatio
    return pxTransformConfig
  }

  getInitPxTransform (buildConfig: ViteHarmonyBuildConfig) {
    const pxTransformConfig = this.getPxTransformConfig(buildConfig)

    return this.transArr2Str([
      'initPxTransform({',
      this.transArr2Str([
        `designWidth: ${pxTransformConfig.designWidth},`,
        `deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)},`,
        `baseFontSize: ${pxTransformConfig.baseFontSize},`,
        `unitPrecision: ${pxTransformConfig.unitPrecision},`,
        `targetUnit: ${JSON.stringify(pxTransformConfig.targetUnit)},`,
      ], 2),
      '})',
    ])
  }
}
