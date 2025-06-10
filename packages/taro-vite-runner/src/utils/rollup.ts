import { escapeId } from '.'

import type { InternalModuleFormat } from 'rollup'

/*
  The following functions are copied from rollup
  https://github.com/rollup/rollup/blob/0bcf0a672ac087ff2eb88fbba45ec62389a4f45f/src/ast/nodes/MetaProperty.ts#L145-L193

  https://github.com/rollup/rollup
  The MIT License (MIT)
  Copyright (c) 2017 [these people](https://github.com/rollup/rollup/graphs/contributors)
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export const getResolveUrl = (path: string, URL = 'URL') => `new ${URL}(${path}).href`

const getRelativeUrlFromDocument = (relativePath: string, umd = false) =>
  getResolveUrl(
    `'${escapeId(relativePath)}', ${
      umd ? `typeof document === 'undefined' ? location.href : ` : ''
    }document.currentScript && document.currentScript.src || document.baseURI`
  )

export const getGenericImportMetaMechanism =
  (getUrl: (chunkId: string) => string) =>
    (property: string | null, { chunkId }: { chunkId: string }) => {
      const urlMechanism = getUrl(chunkId)
      return property === null
        ? `({ url: ${urlMechanism} })`
        : property === 'url'
          ? urlMechanism
          : 'undefined'
    }

const getFileUrlFromFullPath = (path: string) => `require('u' + 'rl').pathToFileURL(${path}).href`

const getFileUrlFromRelativePath = (path: string) =>
  getFileUrlFromFullPath(`__dirname + '/${path}'`)

export const getUrlFromDocument = (chunkId: string, umd = false) =>
  `${
    umd ? `typeof document === 'undefined' ? location.href : ` : ''
  }(document.currentScript && document.currentScript.src || new URL('${escapeId(
    chunkId
  )}', document.baseURI).href)`

export const relativeUrlMechanisms: Record<InternalModuleFormat, (relativePath: string) => string> = {
  amd: relativePath => {
    if (relativePath[0] !== '.') relativePath = './' + relativePath
    return getResolveUrl(`require.toUrl('${relativePath}'), document.baseURI`)
  },
  cjs: relativePath =>
    `(typeof document === 'undefined' ? ${getFileUrlFromRelativePath(
      relativePath
    )} : ${getRelativeUrlFromDocument(relativePath)})`,
  es: relativePath => getResolveUrl(`'${relativePath}', import.meta.url`),
  iife: relativePath => getRelativeUrlFromDocument(relativePath),
  system: relativePath => getResolveUrl(`'${relativePath}', module.meta.url`),
  umd: relativePath =>
    `(typeof document === 'undefined' && typeof location === 'undefined' ? ${getFileUrlFromRelativePath(
      relativePath
    )} : ${getRelativeUrlFromDocument(relativePath, true)})`
}
