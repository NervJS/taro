import { Config } from '@stencil/core'
import { OutputTarget } from '@stencil/core/internal'
import { sass } from '@stencil/sass'

import { reactOutputTarget, vue2OutputTarget, vue3OutputTarget } from './output-target'

const isProd = process.env.NODE_ENV === 'production'
const outputTargets: OutputTarget[] = [
  reactOutputTarget({
    componentCorePackage: '@tarojs/components',
    customElementsDir: 'dist/components',
    includeImportCustomElements: true,
    proxiesFile: '../taro-components-library-react/src/components.ts',
  }),
  vue2OutputTarget({
    componentCorePackage: '@tarojs/components',
    componentModels: [{
      elements: ['taro-input-core', 'taro-textarea-core'],
      targetAttr: 'value',
      event: 'update:modelValue',
    }, {
      elements: ['taro-picker-core', 'taro-slider-core'],
      targetAttr: 'value',
      event: 'update:modelValue',
    }, {
      elements: ['taro-switch-core'],
      targetAttr: 'checked',
      event: 'update:modelValue',
    }],
    customElementsDir: 'dist/components',
    includeImportCustomElements: true,
    proxiesFile: '../taro-components-library-vue2/src/components.ts',
  }),
  vue3OutputTarget({
    componentCorePackage: '@tarojs/components',
    componentModels: [{
      elements: ['taro-input-core', 'taro-textarea-core'],
      targetAttr: 'value',
      event: 'input',
    }, {
      elements: ['taro-picker-core', 'taro-slider-core'],
      targetAttr: 'value',
      event: 'change',
    }, {
      elements: ['taro-switch-core'],
      targetAttr: 'checked',
      event: 'change',
    }],
    customElementsDir: 'dist/components',
    includeImportCustomElements: true,
    proxiesFile: '../taro-components-library-vue3/src/components.ts',
  }),
  {
    type: 'dist',
    esmLoaderPath: '../loader',
  },
  {
    type: 'dist-custom-elements'
  },
]

if (!isProd) {
  outputTargets.push({ type: 'docs-readme' })
}

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './src/global.css',
  plugins: [
    sass()
  ],
  sourceMap: !isProd,
  nodeResolve: {
    preferBuiltins: false,
    // @ts-ignore
    mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
  },
  outputTargets,
  bundles: [
    { components: ['taro-checkbox-core', 'taro-checkbox-group-core'] },
    { components: ['taro-movable-area-core', 'taro-movable-view-core'] },
    { components: ['taro-picker-core', 'taro-picker-group'] },
    { components: ['taro-picker-view-core', 'taro-picker-view-column-core'] },
    { components: ['taro-radio-core', 'taro-radio-group-core'] },
    { components: ['taro-swiper-core', 'taro-swiper-item-core'] },
    { components: ['taro-video-core', 'taro-video-control', 'taro-video-danmu'] }
  ],
  buildEs5: 'prod',
  /**
   * Note: 由于 Stencil 的获取 jest 依赖的方式，硬链接模式下仅可使用更目录依赖的版本，所以当前未将相关依赖置于 devDependencies 中声明。
   * 该问题可以通过为 pnpm 新增配置 `package-import-method: clone-or-copy` 修复，不过由于在 Mac 中，[NodeJS 存在问题问题](https://github.com/libuv/libuv/pull/2578)，
   * 实际并不支持 clone 模式，暂不考虑修复
   */
  testing: {
    globals: {
      ENABLE_INNER_HTML: true,
      ENABLE_ADJACENT_HTML: true,
      ENABLE_SIZE_APIS: true,
      ENABLE_TEMPLATE_CONTENT: true,
      ENABLE_MUTATION_OBSERVER: true,
      ENABLE_CLONE_NODE: true,
      ENABLE_CONTAINS: true,
      'ts-jest': {
        diagnostics: false,
        tsconfig: {
          jsx: 'react',
          allowJs: true,
          target: 'ES6'
        }
      }
    },
    moduleNameMapper: {
      '(\\.(css|less|sass|scss))|weui': '<rootDir>/__mocks__/styleMock.js',
      '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFiles: ['<rootDir>/__tests__/setup.ts'],
    testRegex: '(\\.|/)(e2e|spec|test|tt)\\.[jt]sx?$',
    // timers: 'fake',
    transform: {
      '^.+\\.(ts|tsx|js|jsx|css)$': '<rootDir>/node_modules/@stencil/core/testing/jest-preprocessor.js',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
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
