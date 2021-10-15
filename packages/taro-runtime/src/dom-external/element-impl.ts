import { injectable } from 'inversify'
import { getBoundingClientRectImpl, getTemplateContent } from './element'

import type { Ctx } from '../interface'

declare const ENABLE_SIZE_APIS: boolean
declare const ENABLE_TEMPLATE_CONTENT: boolean

@injectable()
export class TaroElementImpl {
  bind (ctx: Ctx) {
    if (ENABLE_SIZE_APIS) {
      ctx.getBoundingClientRect = async function (...args: any[]) {
        return await getBoundingClientRectImpl.apply(ctx, args)
      }
    }
    if (ENABLE_TEMPLATE_CONTENT) {
      bindContent(ctx)
    }
  }
}

function bindContent (ctx: Ctx) {
  Object.defineProperty(ctx, 'content', {
    configurable: true,
    enumerable: true,
    get () {
      return getTemplateContent(ctx)
    }
  })
}
