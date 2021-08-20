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

import { saveMedia } from '../media'

/**
 * 保存视频到系统相册。支持mp4视频格式。
 * @param opts
 * @param {string} opts.filePath - 视频文件路径，可以是临时文件路径也可以是永久文件路径
 * @returns {Promise<*>}
 */
export function saveVideoToPhotosAlbum(opts: Taro.saveVideoToPhotosAlbum.Option): Promise<Taro.General.CallbackResult> {
  return saveMedia(opts, 'video', 'saveVideoToPhotosAlbum')
}
