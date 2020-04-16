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
