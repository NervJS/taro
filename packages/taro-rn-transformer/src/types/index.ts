export const globalAny: any = global
export interface TransformType {
  src: string
  filename: string
  options: {
    nextTransformer: any
    entry?: string
    sourceRoot?: string
    projectRoot: string
    appName?: string
    isEntryFile: (filename: string) => boolean
    designWidth?: number | ((size?: string | number) => number)
    deviceRatio?: Record<string, number>
    rn?: Record<string, any>
  }
}

export interface TransformPage {
  projectRoot: string
  filename: string
  sourceCode: string
  sourceDir: string
}

export interface TransformEntry {
  sourceDir: string
  appName: string
  projectRoot: string
  filename: string
  designWidth: number | ((size?: string | number) => number)
  deviceRatio: Record<string, number>
  entryName: string
}

export interface AppConfig {
  pages: string[]
  subPackages?: SubPackage[]
  subpackages?: SubPackage[]
  designWidth: number | ((size?: string | number) => number)
  deviceRatio?: Record<string, number>
  tabBar:Record<string, any>
}

interface SubPackage {
  /**
   * 分包根路径
   * - 注意：不能放在主包pages目录下
   */
  root: string
  /**
   * 分包路径下的所有页面配置
   */
  pages: string[]
}

export interface TransformLinariaOption {
  /**
   * 源文件路径
   */
  sourcePath: string
  /**
   * 待转换代码
   */
  sourceCode: string
}
