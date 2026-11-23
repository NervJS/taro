import { isAbsolute, resolve } from 'node:path'
import { runInNewContext } from 'node:vm'

import Taro from '@tarojs/api'
import { rollup } from 'rollup'

const publicApi = resolve(__dirname, '../../../taro-platform-harmony-hybrid/dist/api/index.js')
const consumer = '\0save-file-to-disk-consumer'

afterEach(() => jest.restoreAllMocks())

it('reports saveFileToDisk as unsupported in Harmony Hybrid without requesting a download', async () => {
  jest.replaceProperty(process.env, 'NODE_ENV', 'production')
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  const unsupported = jest.fn()
  const options = { filePath: '/reports/monthly.csv' }

  // Bundle a named import from the same generated entry that apps consume.
  const bundle = await rollup({
    input: consumer,
    external: (id, importer) => !!importer && !id.startsWith('.') && !isAbsolute(id),
    treeshake: { moduleSideEffects: false },
    plugins: [{
      name: 'save-file-to-disk-consumer',
      resolveId: id => id === consumer ? id : null,
      load: id => id === consumer ? `export { saveFileToDisk } from ${JSON.stringify(publicApi)}` : null,
    }],
  })
  const exports: Pick<typeof Taro, 'saveFileToDisk'> = Object.create(null)
  try {
    const { output } = await bundle.generate({ format: 'cjs', exports: 'named', interop: 'auto' })
    runInNewContext(output[0].code, { exports, require, process, console, document, window })
  } finally {
    await bundle.close()
  }

  Taro.eventCenter.on('__taroNotSupport', unsupported)
  try {
    await expect(exports.saveFileToDisk(options)).resolves.toEqual({ errMsg: '暂时不支持 API' })
    expect(unsupported).toHaveBeenCalledWith({
      name: 'saveFileToDisk',
      args: [options],
      type: 'method',
      category: 'temporarily',
    })
    expect(click).not.toHaveBeenCalled()
  } finally {
    Taro.eventCenter.off('__taroNotSupport', unsupported)
  }
})
