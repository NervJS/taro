declare module 'webpack/lib/container/ContainerPlugin' {
  import { container } from 'webpack'
  export = container.ContainerPlugin
}

declare module 'webpack/lib/container/ContainerReferencePlugin' {
  import { container } from 'webpack'
  export = container.ContainerReferencePlugin
}

declare module 'webpack/lib/container/ModuleFederationPlugin' {
  import { container } from 'webpack'
  export = container.ModuleFederationPlugin
}

declare module 'webpack/lib/container/RemoteModule' {
  import webpack from 'webpack'
  class RemoteModule extends webpack.Module {
    constructor (request: string, externalRequests: string[], internalRequest: string, shareScope: string)
    request: string
    externalRequests: string[]
    internalRequest: string
    shareScope: string
  }
  export = RemoteModule
}
