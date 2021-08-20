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

export const CONFIG_DIR_NAME = 'config'
export const DEFAULT_CONFIG_FILE = 'index'

export const PRESET_PREFIX = '@tarojs/preset-'
export const PLUGIN_PREFIX = '@tarojs/plugin-'

export const IS_EVENT_HOOK = /^on/
export const IS_ADD_HOOK = /^add/
export const IS_MODIFY_HOOK = /^modify/

export const presetOrPluginPrefixReg = new RegExp(`^${PRESET_PREFIX}|${PLUGIN_PREFIX}`)

export enum PluginType {
  Preset = 'Preset',
  Plugin = 'Plugin'
}

export const PluginNamePrefix = {
  [PluginType.Preset]: PLUGIN_PREFIX,
  [PluginType.Plugin]: PLUGIN_PREFIX
}
