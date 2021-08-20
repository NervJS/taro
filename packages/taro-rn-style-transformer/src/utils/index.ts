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

import fs from 'fs'
import path from 'path'
import { printLog, processTypeEnum } from '@tarojs/helper'
import { ResolveStyleOptions, LogLevelEnum } from '../types'

export function insertBefore (source: string, target: string) {
  if (!source && !target) {
    return ''
  }
  if (!source) {
    return target
  }
  if (!target) {
    return source
  }
  return target + ';\n' + source
}

export function insertAfter (source: string, target: string) {
  if (!source && !target) {
    return ''
  }
  if (!source) {
    return target
  }
  if (!target) {
    return source
  }
  return source + ';\n' + target
}

// Iterate through the include paths and extensions to find the file variant
export function findVariant (name, extensions, includePaths) {
  for (let i = 0; i < includePaths.length; i++) {
    const includePath = includePaths[i]

    // try to find the file iterating through the extensions, in order.
    const foundExtention = extensions.find(extension => {
      const fname = path.join(includePath, name + extension)
      return fs.existsSync(fname)
    })

    if (foundExtention) {
      return path.join(includePath, name + foundExtention)
    }
  }

  return ''
}

/**
 * 返回存在的文件path
 * @param id import id
 * @param opts { basedir, platform, paths }
 */
export function resolveStyle (id: string, opts: ResolveStyleOptions) {
  const {
    basedir,
    platform,
    paths = [],
    alias = {},
    defaultExt = '',
    logLevel = LogLevelEnum.ERROR
  } = opts
  Object.keys(alias).forEach(key => {
    if (id.startsWith(key)) {
      id = id.replace(key, alias[key])
    }
  })

  const { dir, name, ext: idExt } = path.parse(id)
  const incPaths = [path.resolve(basedir, dir)].concat(paths)
  const ext = idExt || defaultExt

  const exts = [
    // add the platform specific extension, first in the array to take precedence
    platform === 'android' ? '.android' + ext : '.ios' + ext,
    '.rn' + ext,
    ext
  ]

  const file = findVariant(name, exts, incPaths)
  if (!file) {
    const levelMessage = `
    样式文件没有找到，请检查文件路径: ${id}
      在 [
        ${incPaths.join(',\n       ')}
      ]
    `
    if (logLevel === LogLevelEnum.ERROR) {
      throw new Error(levelMessage)
    }
    if (logLevel === LogLevelEnum.WARNING) {
      printLog(processTypeEnum.WARNING, levelMessage)
      return id
    }
  }

  return file
}

export default {}
