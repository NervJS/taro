import http from '@ohos.net.http'

export type FetchOptions = {
  headers?: Record<string, any>
  usingCache?: boolean
}

export type FetchResult = {
  headers: Record<string, any>
  result: ArrayBuffer
  responseCode?: number
}

export async function fetchDataFromUrl(url: string, options: FetchOptions = { usingCache: true }, onProgress?: (progress: number) => void): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const httpRequest = http.createHttp()
    const dataChunks: ArrayBuffer[] = []
    let result: ArrayBuffer | undefined
    let headers: Record<string, any> | undefined
    let responseCode: number | undefined

    function cleanUp() {
      httpRequest.destroy()
    }

    function maybeResolve() {
      if (result !== undefined && headers !== undefined && responseCode !== undefined) {
        resolve({ headers, result, responseCode })
        cleanUp()
      }
    }

    httpRequest.on('dataReceiveProgress', ({ receiveSize, totalSize }) => {
      onProgress?.(receiveSize / totalSize)
    })

    httpRequest.on('headersReceive', (data) => {
      headers = data
      maybeResolve()
    })

    httpRequest.on('dataReceive', (chunk) => {
      dataChunks.push(chunk)
    })

    httpRequest.on('dataEnd', () => {
      const totalLength = dataChunks.map(chunk => chunk.byteLength).reduce((acc, length) => acc + length, 0)
      const data = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of dataChunks) {
        const chunkArray = new Uint8Array(chunk)
        data.set(chunkArray, offset)
        offset += chunk.byteLength
      }
      result = data.buffer
      maybeResolve()
    })

    try {
      httpRequest.requestInStream(
        url,
        {
          header: options.headers,
          usingCache: options.usingCache
        },
        (err, data) => {
          responseCode = data
          if (err) {
            reject(new Error(`Couldn't fetch data from ${url}, ${err.message}`))
            cleanUp()
          } else {
            maybeResolve()
          }
        }
      )
    } catch (err) {
      reject(new Error(`Couldn't fetch data from ${url}, ${err.message}`))
      cleanUp()
    }
  })
}
