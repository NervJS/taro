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

import * as _ from 'lodash/fp'
import joi2desc from './joi2desc'
import configSchema from './configSchema'

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
