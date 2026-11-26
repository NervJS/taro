import {
  type ITaroLoaderResolved,
  parseEntryNameFromQuery,
  parseTemplateNameFromQuery,
  resolveH5EntryLoader,
  resolveMiniEntryLoader
} from '../utils/context'

import type { LoaderContext } from '@rspack/core'

const MINI_TEMPLATE_SOURCES = {
  comp: "/* eslint-disable no-undef */\nimport { createRecursiveComponentConfig } from '@tarojs/runtime'\n\n// @ts-ignore\nComponent(createRecursiveComponentConfig(undefined, TARO_FORCE_CUSTOM_WRAPPER))\n",
  'comp-new-blended': "/* eslint-disable no-undef */\nimport { createRecursiveComponentConfig } from '@tarojs/runtime'\n\n// @ts-ignore\nComponent(createRecursiveComponentConfig(undefined, TARO_FORCE_CUSTOM_WRAPPER))\n",
  'custom-wrapper': "/* eslint-disable no-undef */\nimport { createRecursiveComponentConfig } from '@tarojs/runtime'\n// @ts-ignore\nComponent(createRecursiveComponentConfig('custom-wrapper'))\n"
} as const

export function pitch (this: LoaderContext<any>) {
  const templateName = parseTemplateNameFromQuery(this.resourceQuery)
  if (templateName && templateName in MINI_TEMPLATE_SOURCES) {
    return MINI_TEMPLATE_SOURCES[templateName as keyof typeof MINI_TEMPLATE_SOURCES]
  }
}

export default function taroEntryLoader (this: LoaderContext<any>, source: string, map?: any) {
  const mode = (this.getOptions?.() as { mode?: 'h5' | 'mini' } | undefined)?.mode

  let resolved: ITaroLoaderResolved | null = null
  if (mode === 'h5') {
    resolved = resolveH5EntryLoader(this.resourcePath)
  } else {
    // Skip vue-loader virtual sub-requests (e.g. ?vue&type=template / ?vue&type=script / ?vue&type=style)
    // which inherit the parent .vue entry's resourceQuery.
    if (/[?&]vue(&|=|$)/.test(this.resourceQuery || '')) {
      this.callback(null, source, map)
      return
    }

    const entryName = parseEntryNameFromQuery(this.resourceQuery)
    if (entryName) {
      resolved = resolveMiniEntryLoader(entryName, this.resourcePath)
    }
  }

  if (!resolved) {
    this.callback(null, source, map)
    return
  }

  const rawLoader = require(resolved.loader)
  const loaderFn = rawLoader.default || rawLoader
  const ctx = Object.create(this, {
    getOptions: {
      value: () => resolved.options
    }
  })

  return loaderFn.call(ctx, source, map)
}
