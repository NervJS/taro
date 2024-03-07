import { TaroElement } from './element'

import type { CanvasProps, CanvasTouchEvent } from '@tarojs/components/types'

@Observed
export class TaroCanvasElement extends TaroElement<CanvasProps, CanvasTouchEvent> {
  settings: RenderingContextSettings
  context: CanvasRenderingContext2D

  constructor() {
    this.settings = new RenderingContextSettings(true)
    this.context = new CanvasRenderingContext2D(this.settings)
    super('Canvas')
  }
}
