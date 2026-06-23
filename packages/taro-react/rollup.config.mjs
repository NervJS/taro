import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'

const __filename = fileURLToPath(new URL(import.meta.url))
const cwd = path.dirname(__filename)

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  plugins: [
    externals(),
    typescript()
  ]
}

const esmConfig = Object.assign({}, baseConfig, {
  output: {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/react.esm.js')
  }
})

export default [esmConfig]
