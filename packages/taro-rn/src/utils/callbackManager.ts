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

interface CallbackManager {
  add: (opt: any) => void;
  remove: (opt: any) => void;
  clear: () => void;
  count: () => number;
  trigger: (...args: any[]) => void;
}

export function createCallbackManager(): CallbackManager {
  const _callbacks: Set<any> = new Set()

  const add = (opt) => {
    _callbacks.add(opt)
  }

  const remove = (opt) => {
    _callbacks.delete(opt)
  }

  const clear = () => {
    _callbacks.clear()
  }

  const count = (): number => {
    return _callbacks.size
  }

  const trigger = (...args) => {
    _callbacks.forEach(opt => {
      if (typeof opt === 'function') {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        callback.call(ctx, ...args)
      }
    })
  }

  return {
    add,
    remove,
    clear,
    count,
    trigger,
  }
}
