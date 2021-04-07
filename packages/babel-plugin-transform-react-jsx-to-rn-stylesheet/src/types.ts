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
    parserOpts: Record<string, any>
    generatorOpts: Record<string, any>
  }
  declarations: Record<string, any>
  path: NodePath | null
  ast: Record<string, any>
  scope: unknown
  metadata: Record<string, any>
  code: string
  inputMap: Record<string, any> | null
}

export type Opts = {
  extensions?: string[]
}

export type State = {
  file: BabelTransformationFile
  opts: Opts
}
