import Taro from '@tarojs/api'

import { findDOM } from '../../utils'
import { CanvasContext } from './CanvasContext'

/**
 * 创建 canvas 的绘图上下文 CanvasContext 对象
 * 
 * @canUse createCanvasContext
 */
export const createCanvasContext: typeof Taro.createCanvasContext = (canvasId, inst) => {
  const el = findDOM(inst) as HTMLElement
  const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement
  const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D
  const context = new CanvasContext(canvas, ctx)
  if (!ctx) return context
  context.canvas = canvas
  context.ctx = ctx

  return context
}
