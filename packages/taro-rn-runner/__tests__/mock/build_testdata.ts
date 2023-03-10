/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

const path = require('path')

export const appPath = path.resolve(__dirname, '../../../..', '')

export const config = {
  entry: 'app',
  copy: { patterns: [], options: {} },
  sourceRoot: 'src',
  outputRoot: 'dist',
  platform: 'rn',
  framework: 'react',
  baseLevel: undefined,
  csso: undefined,
  sass: { options: {}, additionalData: '' },
  uglify: undefined,
  plugins: [],
  projectName: 'taroRnInit',
  env: { NODE_ENV: '"development"' },
  defineConstants: { __TEST__: '"RN测试静态常量"' },
  designWidth: 750,
  deviceRatio: { 640: 1.17, 750: 1, 828: 0.905 },
  terser: undefined,
  appName: '',
  output:
    {
      android: 'androidbundle/index.bundle',
      ios: 'iosbundle/main.bundle'
    },
  postcss:
    {
      options: {},
      scalable: true,
      pxtransform: { enable: true, config: {} }
    },
  less: { options: {}, additionalData: '' },
  stylus: { options: {}, additionalData: '' },
  EXPLORER_PATH: 'src',
  EXPLORER_SHELL: 'yarn run wb-bundle',
  sourceDir: '',
  isWatch: true,
  mode: 'development',
  modifyWebpackChain: [],
  modifyBuildAssets: [],
  modifyMiniConfigs: [],
  onBuildFinish: [],
  nodeModulesPath:
    path.resolve(__dirname, '../../../..', 'node_modules'),
  deviceType: 'android',
  port: undefined,
  buildAdapter: 'rn',
  globalObject: 'global',
  resetCache: true
}

export const configNoWatch = {
  ...config,
  isWatch: false
}
