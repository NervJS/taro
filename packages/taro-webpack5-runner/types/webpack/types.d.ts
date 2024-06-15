declare module 'webpack/types' {
  import { container } from 'webpack'

  export type ContainerReferencePluginOptions = ConstructorParameters<typeof container.ContainerReferencePlugin>[0]
  export type ModuleFederationPluginOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0]

  export interface RemotesConfig {
    external: string | string[]
    shareScope?: string
  }
}

