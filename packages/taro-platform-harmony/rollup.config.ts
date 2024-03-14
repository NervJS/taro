import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { fs } from '@tarojs/helper'
import { basename, join } from 'path'
import { type InputPluginOption, type RollupOptions, defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const base: RollupOptions & { plugins: InputPluginOption[] } = {
  external: d => {
    return /^@(system\.|ohos\.|hmscore\/|jd-oh\/)/.test(d)
  },
  plugins: [
    externals({
      devDeps: false
    }),
    nodeResolve({
      preferBuiltins: false
    }),
    ts({
      tsconfig: e => ({
        ...e,
        declaration: true,
        sourceMap: true,
      })
    }),
    commonjs()
  ]
}

// 供 CLI 编译时使用的 Taro 插件入口
const compileConfig: RollupOptions = {
  ...base,
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    ...base.plugins,
    (() => {
      let isWatched = false
      return {
        name: 'copy-runtime-watch',
        async buildEnd () {
          if (isWatched) return

          const targets = [
            { src: 'src/template/container.js', dest: 'dist/template' },
            { src: 'src/components/components-harmony-ets', dest: 'dist' },
            { src: 'src/components/components-harmony', dest: 'dist' },
            { src: 'src/apis', dest: 'dist' },
            { src: 'src/runtime-ets', dest: 'dist' },
            { src: 'src/runtime-framework', dest: 'dist' },
          ]

          for (const item of targets) {
            try {
              let src = item.src
              let dest = item.dest
              dest = join(dest, basename(src))

              src = join(cwd, src)
              dest = join(cwd, dest)
              const stat = fs.statSync(src)
              fs.ensureDirSync(dest)
              if (stat.isDirectory()) {
                fs.copySync(src, dest, { recursive: true })
                fs.watch(src, { recursive: true }, (_event, filename) => {
                  if (!filename) return
                  fs.copyFileSync(join(src, filename), join(dest, filename))
                })
              } else if (stat.isFile()) {
                const filename = basename(src)
                fs.copyFileSync(src, join(dest, filename))
                fs.watchFile(src, () => {
                  fs.copyFileSync(join(src), join(dest, filename))
                })
              }
            } catch (error) {
              console.error(error)
            }
          }

          isWatched = true
        }
      }
    })(),
  ]
}

// 供 Loader 使用的运行时入口
const runtimeConfig: RollupOptions = {
  ...base,
  input: join(cwd, 'src/runtime.ts'),
  output: {
    file: join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  }
}

// 供继承的包使用，为了能 tree-shaking
const runtimeUtilsConfig: RollupOptions = {
  ...base,
  input: join(cwd, 'src/runtime-utils.ts'),
  output: {
    file: join(cwd, 'dist/runtime-utils.js'),
    format: 'es',
    sourcemap: true
  }
}

// React 下 webpack 会 alias @tarojs/components 为此文件
const otherConfig: RollupOptions = {
  ...base,
  input: join(cwd, 'src/components/components-react.ts'),
  output: {
    file: join(cwd, 'dist/components/components-react.js'),
    format: 'es',
    sourcemap: true
  },
  plugins: [
    ts({
      tsconfig: e => ({
        ...e,
        declaration: false,
      })
    })
  ]
}

export default defineConfig([compileConfig, runtimeConfig, runtimeUtilsConfig, otherConfig])
