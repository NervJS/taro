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

import { IMinidev, useDefaults } from 'minidev'
import TTInstance from 'tt-ide-cli'

export type AlipayInstance = { minidev: IMinidev; useDefaults: typeof useDefaults }

export type TTInstance = typeof TTInstance

export module DingTalk {

  interface IOpenSDKConfig {
    appKey: string
    appSecret: string
    accessToken?: string
    host?: string
  }

  export interface ITaskProgressMessage<T> {
    status: 'pending' |'building' |'success' |'failed' | 'overtime'
    data: T
  }
  export interface ITaskOptionBase {
    project: string
    miniAppId: string
    onProgressUpdate: <T>(message: ITaskProgressMessage<T>) => void
  }
  export interface IBuildTaskParams extends ITaskOptionBase {
    packageVersion?: string
  }
  interface IPreviewBuildOptions extends ITaskOptionBase {
    page?: string
    query?: string
    corpId?: string
    ignoreHttpReqPermission?: boolean
    ignoreWebViewDomainCheck?: boolean
    buildTarget: 'Preview'|'RemoteLegacy'|'RemoteX'|'RemoteXLite'|'RemoteBoatman'|'Publish'
  }
  interface MiniAppOpenSDK {
    /** 配置 */
    setConfig(config: IOpenSDKConfig)

    /** 预览小程序 */
    previewBuild(options: IPreviewBuildOptions): Promise<string>

    /** 上传小程序 */
    miniUpload(options: IBuildTaskParams)
  }
}
