import { isUrlRequest, urlToRequest } from 'loader-utils'

export default async function miniXScriptLoader (this: any, source: string) {
  const REG_REQUIRE = /require\(['"](.+\.wxs)['"]\)/g
  const callback = this.async()
  const importings: any[] = []
  let res: RegExpExecArray | null

  try {
    while ((res = REG_REQUIRE.exec(source)) !== null) {
      const dep = res[1]
      if (isUrlRequest(dep)) {
        const request = urlToRequest(dep)
        importings.push(this.importModule(request))
      }
    }
    await Promise.all(importings)
    callback(null, source)
  } catch (error) {
    callback(error, source)
  }
}
