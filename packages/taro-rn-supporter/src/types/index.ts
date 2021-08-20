/*!
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

// https://taro-docs.jd.com/taro/docs/config-detail/
interface Output {
  android: string,
  ios: string
}

interface Copy {
  patterns: [],
  options: Record<string, any>
}

interface Csso {
  enable: boolean,
  config: Record<string, any>
}

interface Sass {
  resource: [],
  projectDirectory: string,
  data: string
}

export interface Config {
  projectName?: string,
  date?: string,
  designWidth?: number,
  deviceRatio?: Record<string, any>,
  sourceRoot?: string,
  outputRoot?: string,
  defineConstants?: Record<string, any>,
  alias?: Record<string, any>,
  env?: Record<string, any>,
  sass?: Sass,
  copy?: Copy,
  plugins?: [],
  presets?: [],
  terser?: Record<string, any>,
  csso?: Csso,
  framework?: Record<string, any>,
  mini?: Record<string, any>,
  h5?: Record<string, any>,
  rn?: any,
}

export interface RNConfig extends Config{
  appName?: boolean,
  entry?: string,
  output?: Output,
  sourceDir?: string,
  postcss?: Record<string, any>,
  less?: Record<string, any>,
  sass?: Sass
  stylus?: Record<string, any>,
  transformer?: any,
  babelPlugin?: any,
  resolve?: ResolveOption
}

export interface ResolveOption {
  include?: string[], // 包含的 node_modules 进行 resolve 处理，默认不处理
}
