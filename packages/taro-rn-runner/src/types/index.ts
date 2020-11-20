// https://taro-docs.jd.com/taro/docs/config-detail/
interface Output {
  android: string,
  ios: string
}

interface Copy {
  patterns: [],
  options: object
}

interface Csso {
  enable: boolean,
  config: object
}

interface Sass {
  resource: [],
  projectDirectory: string,
  data: string
}

export interface Config {
  projectName?: string,
  date?: string,
  designWidth?: number,
  deviceRatio?: object,
  sourceRoot?: string,
  outputRoot?: string,
  defineConstants?: object,
  alias?: object,
  env?: object,
  sass?: Sass,
  copy?: Copy,
  plugins?: [],
  presets?: [],
  terser?: object,
  csso?: Csso,
  framework?: object,
  mini?: object,
  h5?: object,
  rn?: object,
}

export interface RNConfig extends Config {
  appName?: boolean,
  entry?: string,
  output?: Output,
  sourceDir?: string,
  postcss?: object,
  less?: object,
  stylus?: object,
  transformer?: any,
  babelPlugin?: any,
}
