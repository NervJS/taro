import _display from '@ohos.display'
import { TurboModule } from '../TurboModule'

const display = _display.getDefaultDisplaySync()
export class UnitManagerTurboModule extends TurboModule {
  public static readonly NAME = 'UnitManager'

  px2vp(value: number) {
    return px2vp(value)
  }
  vp2px(value: number) {
    return vp2px(value)
  }
  densityPixels(): number  {
    return display.densityPixels;
  }
}
