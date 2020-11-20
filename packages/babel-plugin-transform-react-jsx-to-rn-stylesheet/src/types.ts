import { NodePath } from '@babel/traverse'

type BabelTransformationFile = {
  opts: {
    filename: string
    babelrc: boolean
    configFile: boolean
    passPerPreset: boolean
    envName: string
    cwd: string
    root: string
    plugins: unknown[]
    presets: unknown[]
    parserOpts: object
    generatorOpts: object
  }
  declarations: object
  path: NodePath | null
  ast: object
  scope: unknown
  metadata: object
  code: string
  inputMap: object | null
}

export type Opts = {
  extensions?: string[]
}

export type State = {
  file: BabelTransformationFile
  opts: Opts
}
