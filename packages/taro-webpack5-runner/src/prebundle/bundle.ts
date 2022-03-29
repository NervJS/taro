import * as fs from 'fs-extra'
import * as path from 'path'
import esbuild from 'esbuild'
import { init, parse } from 'es-module-lexer'
import {
  flattenId,
  externalModule,
  getResolve,
  getDepsCacheDir,
  getDefines
} from './utils'
import {
  assetsRE
} from './constant'

import type { CollectedDeps } from './constant'
import type { MiniCombination } from '../webpack/MiniCombination'

type ExportsData = ReturnType<typeof parse> & { hasReExports?: boolean, needInterop?: boolean }

// esbuild generates nested directory output with lowest common ancestor base
// this is unpredictable and makes it difficult to analyze entry / output
// mapping. So what we do here is:
// 1. flatten all ids to eliminate slash
// 2. in the plugin, read the entry ourselves as virtual files to retain the
//    path.
export async function bundle (deps: CollectedDeps, combination: MiniCombination) {
  await init

  const appPath = combination.appPath
  const flattenDeps: CollectedDeps = new Map()
  const flatIdExports = new Map<string, ExportsData>()

  for (const [id, dep] of deps.entries()) {
    // flatten id
    const flatId = flattenId(id)
    flattenDeps.set(flatId, dep)
    // Use es-module-lexer to check ES exports
    // But "export * from" syntax should be checked alone
    const fileContent = fs.readFileSync(dep, 'utf-8')
    const exportsData: ExportsData = parse(fileContent)
    for (const { ss, se } of exportsData[0]) {
      const exp = fileContent.slice(ss, se)
      if (/export\s+\*\s+from/.test(exp)) {
        exportsData.hasReExports = true
      }
    }
    flatIdExports.set(flatId, exportsData)
  }

  // bundle deps
  const entryPlugin = getEntryPlugin(flattenDeps, flatIdExports)
  const depsCacheDir = getDepsCacheDir(appPath)
  fs.existsSync(depsCacheDir)
    ? fs.emptyDirSync(depsCacheDir)
    : fs.ensureDirSync(depsCacheDir)

  const result = await esbuild.build({
    absWorkingDir: appPath,
    entryPoints: Array.from(flattenDeps.keys()),
    bundle: true,
    format: 'esm',
    define: getDefines(combination),
    splitting: true,
    metafile: true,
    ignoreAnnotations: true,
    outdir: depsCacheDir,
    plugins: [
      entryPlugin
    ]
  })

  // esbuild 把 Commonjs 转 ESM 时，打包后只有 export default 语句，
  // 无法实现原模块 module.exports = 的功能。
  // 因此使用一个 CommonJS 规范的中间模块进行处理。
  const processAll: Promise<void>[] = []
  const metaOutput = result.metafile.outputs

  for (const outputName in metaOutput) {
    const output = metaOutput[outputName]

    if (!output.entryPoint?.startsWith('entry:')) continue

    const entry = output.entryPoint.replace(/^entry:/, '')
    if (!flatIdExports.has(entry)) continue

    const exportsData = flatIdExports.get(entry)
    if (
      exportsData?.needInterop &&
      output.exports.length === 1 &&
      output.exports[0] === 'default'
    ) {
      const srcPath = path.join(appPath, outputName)
      const destPath = path.join(appPath, outputName.replace(/(\.js)$/, '.core$1'))
      const p = fs.move(srcPath, destPath)
        .then(() => fs.writeFile(
          srcPath,
          `const m = require('./${path.basename(destPath)}')
module.exports = m.default
exports.default = module.exports
`
        ))

      processAll.push(p)
    }
  }

  await processAll

  return {
    metafile: result.metafile
  }
}

function getEntryPlugin (flattenDeps: CollectedDeps, flatIdExports: Map<string, ExportsData>) {
  const resolve = getResolve()
  return {
    name: 'entry',
    setup (build) {
      // assets
      build.onResolve(({ filter: assetsRE }), externalModule)

      build.onResolve({ filter: /^[\w@][^:]/ }, async ({ path: id, importer }) => {
        // entry
        if (!importer && flattenDeps.has(id)) {
          return {
            path: id,
            namespace: 'entry'
          }
        }

        const resolvedPath = await resolve(importer, id)
        if (assetsRE.test(resolvedPath)) {
          return externalModule({ path: id })
        } else {
          return {
            path: resolvedPath
          }
        }
      })

      build.onLoad({ filter: /^[\w@][^:]/, namespace: 'entry' }, async ({ path: id }) => {
        let js = ''
        const filePath = flattenDeps.get(id)
        const exportsData = flatIdExports.get(id)!
        const [importsList, exportsList] = exportsData
        const hasReExports = exportsData.hasReExports

        if (!importsList.length && !exportsList.length) {
          /** CommonJS */
          exportsData.needInterop = true
          js = `module.exports = require("${filePath}")`
        } else {
          /** ESM */
          if (exportsList.includes('default')) {
            // export default
            js += `import d from "${filePath}";export default d;`
          }
          if (
            hasReExports ||
            exportsList.length > 1 ||
            exportsList[0] !== 'default'
          ) {
            // export * from 'xx'
            // export const xx
            js += `export * from "${filePath}";`
          }
        }

        // console.log('\n[debug] found entry: ', id)
        // console.log('[debug]: filePath', filePath)
        // console.log('[debug] importsData: ', flatIdExports.get(id))
        // console.log('[debug] js: ', js)

        return {
          loader: 'js',
          contents: js,
          resolveDir: process.cwd()
        }
      })
    }
  }
}
