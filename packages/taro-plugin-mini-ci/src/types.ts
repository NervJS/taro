// import { IMinidev, useDefaults } from 'minidev'

// export * as TTInstance from 'tt-ide-cli'

// @FIXME miniprogram-ci、minidev、tt-ide-cli 这些包的依赖有非常多废弃和告警，所以不安装为 dev 依赖，后续手动补充类型
type IMinidev = any
declare const useDefaults

export type AlipayInstance = { minidev: IMinidev, useDefaults: typeof useDefaults }

export namespace DingTalk {
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
  export interface MiniAppOpenSDK {
    /** 配置 */
    setConfig(config: IOpenSDKConfig)

    /** 预览小程序 */
    previewBuild(options: IPreviewBuildOptions): Promise<string>

    /** 上传小程序 */
    miniUpload(options: IBuildTaskParams)
  }
}
