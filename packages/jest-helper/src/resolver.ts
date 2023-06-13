import { defaultMainFields } from '@tarojs/helper'

import type { ResolverOptions } from 'jest-resolve'

export default (path: string, options: ResolverOptions) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg: any) => {
      return {
        ...pkg,
        main: pkg[defaultMainFields.find((e) => pkg[e]) || 'main'],
      }
    },
  })
}
