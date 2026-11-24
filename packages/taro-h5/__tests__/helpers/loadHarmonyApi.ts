import { isAbsolute, resolve } from 'node:path'
import { runInNewContext } from 'node:vm'

import { rollup } from 'rollup'

import type Taro from '@tarojs/api'

/** Import a named API from the generated public entry through a real Rollup consumer. */
export async function loadHarmonyApi<K extends keyof typeof Taro> (name: K): Promise<(typeof Taro)[K]> {
  const publicApi = resolve(__dirname, '../../../taro-platform-harmony-hybrid/dist/api/index.js')
  const consumer = '\0harmony-api-consumer'
  const bundle = await rollup({
    input: consumer,
    external: (id, importer) => !!importer && !id.startsWith('.') && !isAbsolute(id),
    treeshake: { moduleSideEffects: false },
    plugins: [{
      name: 'harmony-api-consumer',
      resolveId: id => id === consumer ? id : null,
      load: id => id === consumer ? `export { ${String(name)} } from ${JSON.stringify(publicApi)}` : null,
    }],
  })
  const exports: Pick<typeof Taro, K> = Object.create(null)
  try {
    const { output } = await bundle.generate({ format: 'cjs', exports: 'named', interop: 'auto' })
    runInNewContext(output[0].code, { exports, require, process, console, document, window })
    return exports[name]
  } finally {
    await bundle.close()
  }
}
