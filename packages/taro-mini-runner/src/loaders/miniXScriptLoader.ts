import { isUrlRequest, urlToRequest } from 'loader-utils'

export default async function (source) {
  const REG_REQUIRE = /require\(['"](.+\.wxs)['"]\)/g
  const callback = this.async()

  let res
  const importings: any[] = []
  const importPromises: any[] = []
  try {
    while ((res = REG_REQUIRE.exec(source)) !== null) {
      const dep = res[1]
      if (isUrlRequest(dep)) {
        const request = urlToRequest(dep)

        importPromises.push(
          new Promise((resolve, reject) => {
            this.loadModule(request, (err, sourceCode) => {
              if (err) {
                reject(err)
              } else {
                resolve(sourceCode)
              }
            })
          })
        )
      }
    }
    
    await Promise.all(importings)
    callback(null, source)
  } catch (error) {
    callback(error, source)
  }
}
