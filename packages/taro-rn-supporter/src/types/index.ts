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

// https://taro-docs.jd.com/taro/docs/config-detail/
interface Output {
  android: string
  ios: string
}

interface Copy {
  patterns: []
  options: Record<string, any>
}

interface Csso {
  enable: boolean
  config: Record<string, any>
}

interface Sass {
  resource: []
  projectDirectory: string
  data: string
}

export interface Config {
  projectName?: string
  date?: string
  designWidth?: number | ((size: number) => number)
  deviceRatio?: Record<string, number>
  sourceRoot?: string
  outputRoot?: string
  defineConstants?: Record<string, any>
  alias?: Record<string, any>
  env?: Record<string, any>
  sass?: Sass
  copy?: Copy
  plugins?: []
  presets?: []
  terser?: Record<string, any>
  csso?: Csso
  framework?: Record<string, any>
  mini?: Record<string, any>
  h5?: Record<string, any>
  rn?: any
}

export interface RNConfig extends Config{
  appName?: boolean
  entry?: string
  output?: Output
  sourceDir?: string
  postcss?: Record<string, any>
  less?: Record<string, any>
  sass?: Sass
  stylus?: Record<string, any>
  transformer?: any
  babelPlugin?: any
  resolve?: ResolveOption
  enableSvgTransform?: boolean
}

export interface ResolveOption {
  include?: string[] // 包含的 node_modules 进行 resolve 处理，默认不处理
}
