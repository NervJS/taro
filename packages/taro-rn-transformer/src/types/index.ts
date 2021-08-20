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

export const globalAny: any = global
export interface TransformType {
  src: string,
  filename: string,
  options: {
    nextTransformer: any,
    entry?: string,
    sourceRoot?: string,
    projectRoot: string,
    appName?: string,
    isEntryFile: (filename: string) => boolean,
    designWidth?: number,
    deviceRatio?: Record<number, number>
  }
}

export interface TransformPage {
  projectRoot: string,
  filename: string,
  sourceCode: string,
  sourceDir: string,
}

export interface TransformEntry {
  sourceDir: string,
  appName: string,
  projectRoot: string,
  filename: string,
  designWidth: number,
  deviceRatio: Record<number, number>,
  entryName: string
}

export interface AppConfig {
  pages: string[]
  subPackages?: SubPackage[]
  subpackages?: SubPackage[],
  designWidth: number,
  deviceRatio?: Record<number, unknown>,
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
