export interface IPaths {
  appPath: string
  sourcePath: string
  outputPath: string
  nodeModulesPath: string
}

export interface IPlugin {
  id: string
  path: string
  args: any
  apply: () => any
}

export interface IPreset {
  id: string
  path: string
  plugins: IPlugin[]
}
