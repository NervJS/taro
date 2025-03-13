import { TurboModule } from '../TurboModule'

export class StorageManagerTurboModule extends TurboModule {
  public static readonly NAME = 'StorageManager'

  get<T = string>(propName: string): T | undefined {
    return AppStorage.get<T>(propName)
  }

  has(propName: string) {
    return AppStorage.has(propName)
  }
}
