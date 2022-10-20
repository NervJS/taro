import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'
import { sass } from '@stencil/sass'
import { vueOutputTarget } from '@stencil/vue-output-target'

const { jsWithTs: tsjPreset } = require('ts-jest/presets')

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './src/global.css',
  plugins: [
    sass()
  ],
  sourceMap: process.env.NODE_ENV !== 'production',
  nodeResolve: {
    preferBuiltins: false,
    // @ts-ignore
    mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@tarojs/components/react',
      proxiesFile: './h5/react/components.ts'
    }),
    vueOutputTarget({
      componentCorePackage: '@tarojs/components/vue', // i.e.: stencil-library
      proxiesFile: './h5/vue/components.ts'
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    { type: 'docs-readme' }
  ],
  bundles: [
    { components: ['taro-picker-core', 'taro-picker-group'] },
    { components: ['taro-checkbox-core', 'taro-checkbox-group-core'] },
    { components: ['taro-radio-core', 'taro-radio-group-core'] },
    { components: ['taro-swiper-core', 'taro-swiper-item-core'] },
    { components: ['taro-video-core', 'taro-video-control', 'taro-video-danmu'] }
  ],
  buildEs5: 'prod',
  testing: {
    testRegex: '(/__tests__/.*|(\\.|/)(tt|spec))\\.[jt]sx?$',
    transform: {
      ...tsjPreset.transform
    },
    globals: {
      'ts-jest': {
        diagnostics: false,
        tsconfig: {
          allowJs: true,
          jsx: 'react',
          target: 'ES6'
        }
      }
    },
    emulate: [{
      device: 'iPhone 8'
    }]
  },
  rollupConfig: {
    inputOptions: {
      treeshake: true
    }
  },
  rollupPlugins: {
    after: [{
      name: 'add-external',
      options: opts => {
        opts.external = ['@tarojs/taro']

        return opts
      }
    }]
  }
}
