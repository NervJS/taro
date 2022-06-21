declare module 'webpack/types' {
  import webpack from 'webpack'

  const { ContainerReferencePlugin, ModuleFederationPlugin } = webpack.container

  export type ContainerReferencePluginOptions = ConstructorParameters<typeof ContainerReferencePlugin>[0]
  export type ModuleFederationPluginOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0]

  export interface RemotesConfig {
    external: string | string[]
    shareScope?: string
  }
}

