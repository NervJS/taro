import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
const { jsWithTs: tsjPreset } = require('ts-jest/presets')

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './node_modules/weui/dist/style/weui.min.css',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    }
  ],
  bundles: [
    { components: ['taro-picker-core', 'taro-picker-group'] },
    { components: ['taro-checkbox-core', 'taro-checkbox-group-core'] },
    { components: ['taro-radio-core', 'taro-radio-group-core'] },
    { components: ['taro-swiper-core', 'taro-swiper-item-core'] },
    { components: ['taro-video-core', 'taro-video-control', 'taro-video-danmu'] }
  ],
  excludeSrc: ['/test/', '**/.spec.', '/types/', '*.d.ts'],
  testing: {
    testRegex: '(/__tests__/.*|(\\.|/)(tt|spec))\\.[jt]sx?$',
    transform: {
      ...tsjPreset.transform
    },
    globals: {
      'ts-jest': {
        diagnostics: false,
        tsConfig: {
          jsx: 'react',
          allowJs: true,
          target: 'ES6'
        }
      }
    },
    emulate: [{
      device: 'iPhone 8'
    }]
  }
}
