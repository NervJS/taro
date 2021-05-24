import { isFunction, warn } from '@tarojs/shared'
import { inject, injectable, optional } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'

import type { getBoundingClientRectImpl } from './element'

@injectable()
export class TaroElementImpl {
  public rectImpl: typeof getBoundingClientRectImpl

  constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.getBoundingClientRectImpl) @optional() rectImpl: typeof getBoundingClientRectImpl
  ) {
    this.rectImpl = rectImpl
  }

  bind (ctx: Record<string, any>) {
    this.bindRect(ctx)
  }

  bindRect (ctx: Record<string, any>) {
    const impl = this.rectImpl
    ctx.getBoundingClientRect = async function (...args: any[]) {
      if (isFunction(impl)) {
        return await impl.apply(ctx, args)
      }

      process.env.NODE_ENV !== 'production' && warn(true, '请实现 element.getBoundingClientRect')
      return Promise.resolve(null)
    }
  }
}
