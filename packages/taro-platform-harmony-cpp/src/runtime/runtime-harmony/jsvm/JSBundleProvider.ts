import { buffer, util } from '@kit.ArkTS'
import { cryptoFramework } from '@kit.CryptoArchitectureKit'
import fs from '@ohos.file.fs'

import { TaroError } from './Error'
import { fetchDataFromUrl } from './HttpRequestHelper'
import { TaroLogger } from './Logger'

import type resmgr from '@ohos.resourceManager'

export class BundleInfo {
  type: 'network' | 'resource' | 'file'
  path: string
  name: string
  version: string

  constructor(type: 'network' | 'resource' | 'file', path: string, name = '', version = '') {
    this.type = type
    this.path = path
    this.name = name
    this.version = version
  }
}

export function bundleInfos2JSBundleProvider(
  bundleInfos: BundleInfo[],
  resourceManager?: resmgr.ResourceManager
): JSBundleProvider[] {
  return bundleInfos
    .map((item): JSBundleProvider | null => {
      switch (item.type) {
        case 'network':
          return new NetworkJSBundleProvider(item.path, item.name, item.version)
        case 'resource':
          if (resourceManager) {
            return new ResourceJSBundleProvider(resourceManager, item.path)
          }
          break
        case 'file':
          return new FileJSBundleProvider(item.path)
      }
      return null
    })
    .filter((item: JSBundleProvider | null) => !!item)
}

/**
 *
 * @param v1
 * @param v2
 * @returns number -1: <, 0: =, 1: >
 */
function compareVersions(v1: string, v2: string) {
  const v1List = v1.split('.')
  const v2List = v2.split('.')

  if (v1List.length < 3) {
    return -1
  }
  if (v2List.length < 3) {
    return 1
  }

  for (let i = 0; i < 3; i++) {
    if (v1List[i] < v2List[i]) {
      return -1
    } else if (v1List[i] > v2List[i]) {
      return 1
    }
  }
  return 0
}

export function bundleInfos2JSBundleProviderWithVersion(
  bundleInfos: BundleInfo[],
  resourceManager?: resmgr.ResourceManager
): JSBundleProvider[] {
  const validList: BundleInfo[] = []
  const packageMap = {}

  bundleInfos.forEach((item) => {
    if (!item.name) {
      validList.push(item)
      return
    }
    if (!packageMap[item.name]) {
      packageMap[item.name] = [item]
    } else {
      packageMap[item.name].push(item)
      // 按版本号排序从小到大顺序
      for (let i = packageMap[item.name].length - 1; i > 0; i--) {
        const versionCompareResult = compareVersions(
          packageMap[item.name][i - 1].version,
          packageMap[item.name][i].version
        )
        if (versionCompareResult === -1) {
          break
        } else if (versionCompareResult === 1) {
          [packageMap[item.name][i - 1], packageMap[item.name][i]] = [
            packageMap[item.name][i],
            packageMap[item.name][i - 1],
          ]
        } else {
          // 在版本号相同的情况下，本地的优先级比网络的优先级高
          if (packageMap[item.name][i].type === 'network' && packageMap[item.name][i - 1].type !== 'network') {
            [packageMap[item.name][i - 1], packageMap[item.name][i]] = [
              packageMap[item.name][i],
              packageMap[item.name][i - 1],
            ]
          }
        }
      }
    }
  })

  const result = bundleInfos2JSBundleProvider(
    Object.values(packageMap).reduce<BundleInfo[]>((acc, cur: BundleInfo) => {
      return acc.concat(cur)
    }, validList),
    resourceManager
  )
  return result
}

export abstract class JSBundleProvider<TJSBundle = ArrayBuffer | string> {
  abstract getURL(): string | string[]

  abstract getBundle(onProgress?: (progress: number) => void): Promise<TJSBundle | TJSBundle[]>

  getBundleSync(): TJSBundle | TJSBundle[] {
    throw Error('getBundleSync 未实现')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBuffer(onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
    return new ArrayBuffer(0)
  }

  getBufferSync(): ArrayBuffer {
    return new ArrayBuffer(0)
  }

  abstract getAppKeys(): string[]

  async run(cb: (url: string, bundle: TJSBundle, buffer: ArrayBuffer) => Promise<void>): Promise<void> {
    const url = this.getURL() as string
    const bundle = (await this.getBundle()) as TJSBundle
    const buffer = await this.getBuffer()
    return cb(url, bundle, buffer)
  }

  runSync(cb: (url: string, bundle: TJSBundle, buffer: ArrayBuffer) => void) {
    const url = this.getURL() as string
    const bundle = this.getBundleSync() as TJSBundle
    const buffer = this.getBufferSync()
    return cb(url, bundle, buffer)
  }
}

export class JSBundleProviderError extends TaroError {}

export class NetworkJSBundleProviderError extends JSBundleProviderError {}

export class FileJSBundleProvider<TJSBundle = ArrayBuffer> extends JSBundleProvider<TJSBundle> {
  constructor(private path: string, private appKeys: string[] = []) {
    super()
  }

  getURL(): string {
    return this.path
  }

  getAppKeys(): string[] {
    return this.appKeys
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBundle(onProgress?: (progress: number) => void): Promise<TJSBundle> {
    try {
      const file = await fs.open(this.path, fs.OpenMode.READ_ONLY)
      const { size } = await fs.stat(file.fd)
      const buffer = new ArrayBuffer(size)
      await fs.read(file.fd, buffer, { length: size })
      return buffer as TJSBundle
    } catch (err) {
      throw new JSBundleProviderError({
        whatHappened: `Couldn't load JSBundle from ${this.path}`,
        extraData: err,
        howCanItBeFixed: [`Check if a bundle exists at "${this.path}" on your device.`],
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBuffer(onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
    try {
      const file = await fs.open(`${this.path}.v8c`, fs.OpenMode.READ_ONLY)
      const { size } = await fs.stat(file.fd)
      const buffer = new ArrayBuffer(size)
      await fs.read(file.fd, buffer, { length: size })
      return buffer
    } catch (err) {
      console.warn(`Couldn't load JSBundle from ${this.path}.v8c`, err)
      return new ArrayBuffer(0)
    }
  }
}

export class ResourceJSBundleProvider<TJSBundle = ArrayBuffer> extends JSBundleProvider<TJSBundle> {
  constructor(
    private resourceManager: resmgr.ResourceManager,
    private path: string = 'bundle.harmony.js',
    private appKeys: string[] = []
  ) {
    super()
  }

  getURL() {
    return this.path
  }

  getAppKeys() {
    return this.appKeys
  }

  getBundleSync(): TJSBundle | TJSBundle[] {
    try {
      const bundleFileContent = this.resourceManager.getRawFileContentSync(this.path)
      const bundle = bundleFileContent.buffer
      return bundle
    } catch (err) {
      throw new JSBundleProviderError({
        whatHappened: `Couldn't load JSBundle from ${this.path}`,
        extraData: err,
        howCanItBeFixed: [
          `Check if a bundle exists at "<YOUR_ENTRY_MODULE>/src/main/resources/rawfile/${this.path}". (You can create a JS bundle with "react-native bundle-harmony" command.`,
        ],
      })
    }
  }

  getBufferSync(): ArrayBuffer {
    try {
      const bundleFileContent = this.resourceManager.getRawFileContentSync(`${this.path}.v8c`)
      const bundle = bundleFileContent.buffer
      return bundle
    } catch (err) {
      console.warn(`Couldn't load JSBundle from ${this.path}.v8c`, err)
      return new ArrayBuffer(0)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBundle(onProgress?: (progress: number) => void) {
    try {
      const bundleFileContent = await this.resourceManager.getRawFileContent(this.path)
      const bundle = bundleFileContent.buffer
      return bundle
    } catch (err) {
      throw new JSBundleProviderError({
        whatHappened: `Couldn't load JSBundle from ${this.path}`,
        extraData: err,
        howCanItBeFixed: [
          `Check if a bundle exists at "<YOUR_ENTRY_MODULE>/src/main/resources/rawfile/${this.path}". (You can create a JS bundle with "react-native bundle-harmony" command.`,
        ],
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBuffer(onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
    try {
      const bundleFileContent = await this.resourceManager.getRawFileContent(`${this.path}.v8c`)
      const bundle = bundleFileContent.buffer
      return bundle
    } catch (err) {
      console.warn(`Couldn't load JSBundle from ${this.path}.v8c`, err)
      return new ArrayBuffer(0)
    }
  }
}

export class StringJSBundleProvider extends JSBundleProvider {
  constructor(private code: string, private path: string = 'bundle.harmony.js', private appKeys: string[] = []) {
    super()
  }

  getURL() {
    return this.path
  }

  getAppKeys() {
    return this.appKeys
  }

  getBundleSync(): string {
    return this.code
  }

  async getBundle() {
    return this.code
  }
}

export class AnyJSBundleProvider<TJSBundle = ArrayBuffer | string> extends JSBundleProvider<TJSBundle> {
  private pickedJSBundleProvider: JSBundleProvider | undefined = undefined
  private jsBundleProviders: JSBundleProvider[]

  constructor(...providers: JSBundleProvider[]) {
    super()
    this.jsBundleProviders = providers
    if (providers.length === 0) {
      throw new JSBundleProviderError({
        whatHappened: 'AnyJSBundleProvider received an empty list of providers',
        howCanItBeFixed: ['Provide at least one JSBundleProvider to AnyJSBundleProvider'],
      })
    }
  }

  getURL() {
    return this.jsBundleProviders.map((e) => e.getURL() as string)
  }

  getAppKeys() {
    if (!this.pickedJSBundleProvider) {
      return []
    }
    return this.pickedJSBundleProvider.getAppKeys()
  }

  getBundleSync(): TJSBundle {
    const jsBundle: TJSBundle[] = []
    for (const jsBundleProvider of this.jsBundleProviders) {
      try {
        const bundle = jsBundleProvider.getBundleSync() as TJSBundle | TJSBundle[]
        this.pickedJSBundleProvider = jsBundleProvider
        if (bundle instanceof Array) {
          jsBundle.push(...bundle)
        } else {
          jsBundle.push(bundle)
        }
      } catch (err) {
        console.log('err', err) // eslint-disable-line
      }
      if (this.pickedJSBundleProvider) {
        return jsBundle as TJSBundle
      } else {
        throw new Error('None of the provided JSBundleProviders was able to load a bundle')
      }
    }
  }

  async getBundle(onProgress?: (progress: number) => void): Promise<TJSBundle> {
    const errors: JSBundleProviderError[] = []
    const jsBundle: TJSBundle[] = []
    for (const jsBundleProvider of this.jsBundleProviders) {
      try {
        const bundle = (await jsBundleProvider.getBundle(onProgress)) as TJSBundle | TJSBundle[]
        this.pickedJSBundleProvider = jsBundleProvider
        if (bundle instanceof Array) {
          jsBundle.push(...bundle)
        } else {
          jsBundle.push(bundle)
        }
      } catch (err) {
        if (err instanceof NetworkJSBundleProviderError) {
          throw err
        }
        if (err instanceof JSBundleProviderError) {
          errors.push(err)
        }
      }
    }

    if (this.pickedJSBundleProvider) {
      return jsBundle as TJSBundle
    }
    const reducedError = JSBundleProviderError.fromMultipleTaroErrors(errors)
    throw new JSBundleProviderError({
      whatHappened: 'None of the provided JSBundleProviders was able to load a bundle',
      howCanItBeFixed: reducedError.getSuggestions(),
      extraData: reducedError.getDetails(),
    })
  }

  async run(cb) {
    return this.jsBundleProviders.reduce(async (acc, curr) => {
      return acc.then(() => curr.run(cb as any))
    }, Promise.resolve())
  }

  runSync(cb) {
    this.jsBundleProviders.forEach((item) => {
      item.runSync(cb)
    })
  }
}

export class TraceJSBundleProviderDecorator extends JSBundleProvider {
  private logger: TaroLogger

  constructor(private jsBundleProvider: JSBundleProvider, logger: TaroLogger) {
    super()
    this.logger = logger.clone('TraceJSBundleProviderDecorator')
  }

  getURL() {
    return this.jsBundleProvider.getURL()
  }

  getBundleSync(): string | ArrayBuffer | (string | ArrayBuffer)[] {
    return this.jsBundleProvider.getBundleSync()
  }

  async getBundle(onProgress?: (progress: number) => void) {
    const stopTracing = this.logger.clone('getBundle').startTracing()
    const result = await this.jsBundleProvider.getBundle(onProgress)
    stopTracing()
    return result
  }

  getAppKeys() {
    return this.jsBundleProvider.getAppKeys()
  }

  async run(cb) {
    return this.jsBundleProvider.run(cb as any)
  }

  runSync(cb) {
    return this.jsBundleProvider.runSync(cb)
  }
}

export class NetworkJSBundleProvider<TJSBundle = ArrayBuffer | string> extends JSBundleProvider<TJSBundle> {
  constructor(
    private bundleUrl: string = 'https://storage.360buyimg.com/atao/bundle.harmony.js',
    private bundleName = 'bundle.harmony.js',
    private bundleVersion = '0.0.0',
    private contentType = 'text/javascript',
    private appKeys: string[] = []
  ) {
    super()
  }

  getURL() {
    return this.bundleUrl
  }

  stringToUint8Array(str: string) {
    return new Uint8Array(buffer.from(str, 'utf-8').buffer)
  }

  getMd5FromString(str: string) {
    const md = cryptoFramework.createMd('SHA256')
    md.updateSync({ data: this.stringToUint8Array(str) })
    const digestOutput = md.digestSync()
    const buf = buffer.from(digestOutput.data)

    return buf.toString('hex')
  }

  getFilePath() {
    const context = getContext()
    const applicationContext = context.getApplicationContext()
    const tempDir = applicationContext.tempDir

    let filename = `${this.bundleName}${this.bundleUrl}${this.bundleVersion}`

    try {
      filename = this.getMd5FromString(filename).slice(0, 10)
    } catch (e) {
      console.log('md5计算失败', e) // eslint-disable-line
    }

    const filePath = `${tempDir}/${filename}`
    if (this.contentType === 'application/zip') {
      return filePath + '.zip'
    }
    console.log('filePath: ', filePath) // eslint-disable-line
    return filePath
  }

  getAppKeys() {
    return this.appKeys
  }

  async getBundle(onProgress?: (progress: number) => void): Promise<TJSBundle> {
    try {
      // @ts-ignore
      const filePath = this.getFilePath()

      const res = await fs.access(filePath)
      if (res) {
        const file = await fs.open(filePath, fs.OpenMode.READ_ONLY)
        const { size } = await fs.stat(file.fd)
        const buffer = new ArrayBuffer(size)
        await fs.read(file.fd, buffer, { length: size })
        return buffer as TJSBundle
      } else {
        const response = await fetchDataFromUrl(
          this.bundleUrl,
          { headers: { 'Content-Type': this.contentType } },
          onProgress
        )

        if (response.responseCode === 500) {
          this.throwNetworkError(response.result)
        }

        const file = await fs.open(filePath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
        fs.write(file.fd, response.result, undefined, () => {
          fs.close(file)
        })

        return response.result as TJSBundle
      }
    } catch (err) {
      if (err instanceof NetworkJSBundleProviderError) {
        throw err
      }
    }
    return '' as TJSBundle
  }

  throwNetworkError(result: ArrayBuffer) {
    const processChunk = (text: string | undefined) => {
      const content = text ?? ''
      const matches = text?.match(/^([!\x3c-\x3f]*)([\d;]*)([\x20-\x2c]*[\x40-\x7e])([\s\S]*)/m)
      return !matches ? content : matches[4]
    }
    const ansiToText = (txt: string) => {
      const rawTextChunks = txt.split(/\033\[/)
      const firstChunk = rawTextChunks.shift() ?? ''
      const colorChunks = rawTextChunks.map(processChunk)
      colorChunks.unshift(firstChunk)
      return colorChunks.join('')
    }
    const textDecoder = util.TextDecoder.create()
    const err: { message: string, stack: string } = JSON.parse(textDecoder.decodeWithStream(new Uint8Array(result)))
    throw new NetworkJSBundleProviderError({
      whatHappened: ansiToText(err.message),
      customStack: err.stack.replace(err.message, ''),
      howCanItBeFixed: [],
    })
  }
}
