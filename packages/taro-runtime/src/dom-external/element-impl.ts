/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { isFunction, warn } from '@tarojs/shared'
import { inject, injectable, optional } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'

import type { Ctx } from '../interface'
import type { getBoundingClientRectImpl } from './element'

@injectable()
export class TaroElementImpl {
  public rectImpl: typeof getBoundingClientRectImpl

  constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.getBoundingClientRectImpl) @optional() rectImpl: typeof getBoundingClientRectImpl
  ) {
    this.rectImpl = rectImpl
  }

  bind (ctx: Ctx) {
    this.bindRect(ctx)
  }

  bindRect (ctx: Ctx) {
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
