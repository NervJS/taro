/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

const path = require('path')

const appPath = path.resolve(__dirname, '../../../..', '')

const config = {
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
  globalObject: 'global'
}

const configNoWatch = {
  ...config,
  isWatch: false
}

export {
  config,
  configNoWatch,
  appPath
}
