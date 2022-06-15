declare module 'webpack/lib/container/RemoteModule' {
  import webpack from 'webpack'
  class RemoteModule extends webpack.Module {
    constructor (request: string, externalRequests: string[], internalRequest: string, shareScope: string): RemoteModule
    request: string
    externalRequests: string[]
    internalRequest: string
    shareScope: string
  }
  export = RemoteModule
}
