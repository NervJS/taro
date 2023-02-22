/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

export const globalAny: any = global
export interface TransformType {
  src: string
  filename: string
  options: {
    nextTransformer: any
    entry?: string
    sourceRoot?: string
    projectRoot: string
    appName?: string
    isEntryFile: (filename: string) => boolean
    designWidth?: number | ((size: number) => number)
    deviceRatio?: Record<string, number>
    rn?: Record<string, any>
  }
}

export interface TransformPage {
  projectRoot: string
  filename: string
  sourceCode: string
  sourceDir: string
}

export interface TransformEntry {
  sourceDir: string
  appName: string
  projectRoot: string
  filename: string
  designWidth: number | ((size: number) => number)
  deviceRatio: Record<string, number>
  entryName: string
}

export interface AppConfig {
  pages: string[]
  subPackages?: SubPackage[]
  subpackages?: SubPackage[]
  designWidth: number | ((size: number) => number)
  deviceRatio?: Record<string, number>
  tabBar:Record<string, any>
}

interface SubPackage {
  /**
   * 分包根路径
   * - 注意：不能放在主包pages目录下
   */
  root: string
  /**
   * 分包路径下的所有页面配置
   */
  pages: string[]
}

export interface TransformLinariaOption {
  /**
   * 源文件路径
   */
  sourcePath: string
  /**
   * 待转换代码
   */
  sourceCode: string
}
