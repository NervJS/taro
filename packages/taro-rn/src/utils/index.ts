/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

interface ShouldBeObjectResult {
  res: boolean;
  msg?: string;
}

interface GetParameterErrorOption {
  correct: string;
  wrong: any;
}

function upperCaseFirstLetter (string: string): string {
  return string.replace(/^./, match => match.toUpperCase())
}

export function getParameterError ({ correct, wrong }: GetParameterErrorOption): string {
  const parameter = 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

export function shouldBeObject (target: unknown): ShouldBeObjectResult {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function successHandler (success?: (res: TaroGeneral.CallbackResult) => void, complete?: (res: TaroGeneral.CallbackResult) => void) {
  return function (res: TaroGeneral.CallbackResult): Promise<any> {
    success && success(res)
    complete && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail?: (res: TaroGeneral.CallbackResult) => void, complete?: (res: TaroGeneral.CallbackResult) => void) {
  return function (res: TaroGeneral.CallbackResult): Promise<any> {
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
}

/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/

const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
export function isUrl (string: string): boolean {
  if (typeof string !== 'string') {
    return false
  }

  const match = string.match(protocolAndDomainRE)
  if (!match) {
    return false
  }

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) {
    return false
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true
  }

  return false
}

export * from './callbackManager'
