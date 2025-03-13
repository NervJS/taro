import type { TurboModule, TurboModuleContext } from './TurboModule'

export abstract class TurboModulesFactory {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected ctx: TurboModuleContext) {
  }

  abstract createTurboModule(name: string): TurboModule | null

  // prepareEagerTurboModules(): Promise<void> {
  //   return Promise.resolve()
  // }

  abstract hasTurboModule(name: string): boolean
}

class FakeTurboModulesFactory extends TurboModulesFactory {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTurboModule(name: string) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasTurboModule(name: string) {
    return false
  }
}

/**
 * Currently empty. This context provides a way to inject dependencies in the future without in non-breaking changes manner.
 */
export type RNPackageContext = any
export type DescriptorWrapperFactoryByDescriptorTypeCtx = any
// export type DescriptorWrapperFactoryByDescriptorType = Record<string, DescriptorWrapperFactory>

export abstract class TaroPackage {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected ctx: RNPackageContext) {
  }

  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new FakeTurboModulesFactory(ctx)
  }

  getDebugName(): string | undefined {
    return undefined
  }

  // createDescriptorWrapperFactoryByDescriptorType(ctx: DescriptorWrapperFactoryByDescriptorTypeCtx): DescriptorWrapperFactoryByDescriptorType {
  //   return {}
  // }
}
