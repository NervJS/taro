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

import { Bundler, BundleResult } from 'scss-bundle'
import { fs } from '@tarojs/helper'
import * as path from 'path'

interface LoaderOption {
  data?: string
  [key: string]: any
}

interface BuildConfig {
  sass?: {
    resource?: string | string[]
    projectDirectory?: string
    data?: string
  }
  sassLoaderOption?: LoaderOption
}

/**
 * Return bundled sass content.
 *
 * @param {string} url Absolute file path.
 * @param {(string | undefined)} projectDirectory Absolute project location, where node_modules are located.
 * Used for resolving tilde imports.
 * @returns Bundle result.
 */
export async function getBundleResult (url: string,
  projectDirectory: string | undefined = undefined
): Promise<BundleResult> {
  let bundler: Bundler = new Bundler()
  if (projectDirectory) {
    bundler = new Bundler(undefined, projectDirectory)
  }
  const res = await bundler.bundle(url)
  return res
}

/**
 * Return bundled sass content, but input resource can be a single string or an array.
 * @param {(string | string[])} resource Input file path or a path array.
 * @param {(string | undefined)} projectDirectory Absolute project location, where node_modules are located.
 * Used for resolving tilde imports.
 * @returns Bundle result.
 */
export async function getBundleContent (resource: string | string[],
  projectDirectory: string | undefined = undefined
): Promise<string | undefined> {
  let result: string | undefined = ''

  try {
    if (typeof resource === 'string') {
      const res = await getBundleResult(resource, projectDirectory)
      result = res.bundledContent
    }

    if (Array.isArray(resource)) {
      for (const url of resource) {
        const res = await getBundleResult(url, projectDirectory)
        result += res.bundledContent || ''
      }
    }
  } catch (error) {
    throw new Error(error)
  }

  return result
}

/**
 * Check if global imported sass file exists.
 *
 * @param {(string | string[])} resource
 * @param {(string | undefined)} rootDir
 */
function checkPath (resource: string | string[], rootDir: string | undefined) {
  if (Array.isArray(resource)) {
    resource.forEach(item => {
      const url = rootDir ? path.resolve(rootDir, item) : item
      if (!fs.existsSync(url)) {
        throw new Error(`全局注入 scss 文件路径错误: ${url}`)
      }
    })
  } else if (typeof resource === 'string') {
    const url = rootDir ? path.resolve(rootDir, resource) : resource
    if (!fs.existsSync(url)) {
      throw new Error(`全局注入 scss 文件路径错误: ${url}`)
    }
  }
}

/**
 * Return the merged sass loader option.
 * @param {BuildConfig} param0 Build config.
 * @returns Merged sass loader option.
 */
export async function getSassLoaderOption (
  { sass, sassLoaderOption }: BuildConfig
): Promise<LoaderOption> {
  sassLoaderOption = sassLoaderOption || {}

  let bundledContent = ''

  if (!sass) {
    return sassLoaderOption
  }

  const { resource, projectDirectory } = sass
  if (resource) {
    checkPath(resource, projectDirectory)
    const content = await getBundleContent(resource, projectDirectory)
    bundledContent += content
  }

  if (sass.data) {
    bundledContent += sass.data
  }
  return {
    ...sassLoaderOption,
    additionalData: sassLoaderOption.data ? `${sassLoaderOption.data}${bundledContent}` : bundledContent
  }
}

export default getSassLoaderOption
