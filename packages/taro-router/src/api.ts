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

import { stacks } from './stack'
import { history, parsePath } from './history'
import { routesAlias, addLeadingSlash, setHistoryBackDelta } from './utils'

interface Base {
  success?: (...args: any[]) => void
  fail?: (...args: any[]) => void
  complete?: (...args: any[]) => void
}

interface Option extends Base {
  url: string
}

interface NavigateBackOption extends Base {
  delta: number
}

function processNavigateUrl (option: Option) {
  let url = option.url
  const matches = option.url.match(/[?&?].*/)
  let parameters = ''
  if (matches && matches.length) {
    parameters = matches[0]
    url = url.replace(parameters, '')
  }
  Object.keys(routesAlias).forEach(key => {
    if (addLeadingSlash(key) === addLeadingSlash(url)) {
      option.url = routesAlias[key] + parameters
    }
  })
}

function navigate (option: Option | NavigateBackOption, method: 'navigateTo' | 'redirectTo' | 'navigateBack') {
  const { success, complete, fail } = option
  let failReason
  if ((option as Option).url) {
    processNavigateUrl(option as Option)
  }
  try {
    if (method === 'navigateTo') {
      history.push(parsePath((option as Option).url), { timestamp: Date.now() })
    } else if (method === 'redirectTo') {
      history.replace(parsePath((option as Option).url), { timestamp: Date.now() })
    } else if (method === 'navigateBack') {
      setHistoryBackDelta((option as NavigateBackOption).delta)
      history.go(-(option as NavigateBackOption).delta)
    }
  } catch (error) {
    failReason = error
  }

  return new Promise<void>((resolve, reject) => {
    if (failReason) {
      fail && fail(failReason)
      complete && complete()
      reject(failReason)
      return
    }

    const unlisten = history.listen(() => {
      success && success()
      complete && complete()
      resolve()
      unlisten()
    })
  })
}

export function navigateTo (option: Option) {
  return navigate(option, 'navigateTo')
}

export function redirectTo (option: Option) {
  return navigate(option, 'redirectTo')
}

export function navigateBack (options: NavigateBackOption = { delta: 1 }) {
  if (!options.delta || options.delta < 1) {
    options.delta = 1
  }
  return navigate(options, 'navigateBack')
}

export function switchTab (option: Option) {
  return navigateTo(option)
}

export function reLaunch (option: Option) {
  return redirectTo(option)
}

export function getCurrentPages () {
  return stacks
}
