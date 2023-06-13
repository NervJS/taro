import type { ResolverOptions } from 'jest-resolve'

export = (path: string, options: ResolverOptions) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      const field = ['module', 'main'].find((e) => pkg[e] && typeof pkg[e] === 'string')
      if (field) {
        pkg.main = pkg[field] || pkg.main
      }
      return pkg
    },
  })
}
