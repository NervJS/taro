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

import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      require.resolve('@tarojs/plugin-platform-weapp'),
      require.resolve('@tarojs/plugin-platform-alipay'),
      require.resolve('@tarojs/plugin-platform-swan'),
      require.resolve('@tarojs/plugin-platform-tt'),
      require.resolve('@tarojs/plugin-platform-qq'),
      require.resolve('@tarojs/plugin-platform-jd'),
      path.resolve(__dirname, '../../presets', 'platforms', 'h5.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'plugin.ts'),

      // commands
      path.resolve(__dirname, '../../presets', 'commands', 'build.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'init.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'config.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'create.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'info.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'doctor.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'convert.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'update.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'inspect.ts'),

      // files
      path.resolve(__dirname, '../../presets', 'files', 'writeFileToDist.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateProjectConfig.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateFrameworkInfo.ts')
    ]
  }
}
