import type { TaroContext } from '../TaroContext'

export type TurboModuleContext = TaroContext

export class TurboModule {
  public static readonly NAME

  // eslint-disable-next-line no-useless-constructor
  public constructor(protected ctx: TurboModuleContext) {}

  public __onDestroy__() {}
}

export type TurboModuleType = typeof TurboModule
