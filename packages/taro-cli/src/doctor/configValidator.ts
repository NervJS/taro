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

import * as _ from 'lodash/fp'

import configSchema from './configSchema'
import joi2desc from './joi2desc'

function buildDesc (error) {
  return error.path.join('.') + ' ' + joi2desc(error)
}

function buildLine (error) {
  return {
    desc: buildDesc(error),
    valid: false
  }
}

function buildReport (configPath, errors) {
  const errorLines = _.compose(
    _.map(buildLine),
    _.get('details')
  )(errors)
  return {
    desc: `检查 Taro 配置 (${configPath})，请到文档查看详情：https://nervjs.github.io/taro/docs/next/config-detail。`,
    lines: errorLines
  }
}

export default async function ({ configPath, projectConfig }) {
  const { error } = configSchema.validate(projectConfig, { abortEarly: false })
  return buildReport(configPath, error)
}
