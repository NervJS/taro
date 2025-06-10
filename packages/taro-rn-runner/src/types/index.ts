// https://taro-docs.jd.com/taro/docs/config-detail/
interface Output {
  android: string
  ios: string
}

interface Copy {
  patterns: []
  options: Record<string, any>
}

interface Csso {
  enable: boolean
  config: Record<string, any>
}

interface Sass {
  resource: []
  projectDirectory: string
  data: string
}

export interface Config {
  projectName?: string
  date?: string
  designWidth?: number | ((size?: string | number) => number)
  deviceRatio?: Record<string, any>
  sourceRoot?: string
  outputRoot?: string
  defineConstants?: Record<string, any>
  alias?: Record<string, any>
  env?: Record<string, any>
  sass?: Sass
  copy?: Copy
  plugins?: []
  presets?: []
  terser?: Record<string, any>
  csso?: Csso
  framework?: Record<string, any>
  mini?: Record<string, any>
  h5?: Record<string, any>
  rn?: Record<string, any>
}

export interface RNConfig extends Config {
  appName?: boolean
  entry?: string
  output?: Output
  sourceDir?: string
  postcss?: Record<string, any>
  less?: Record<string, any>
  stylus?: Record<string, any>
  transformer?: any
  babelPlugin?: any
}
