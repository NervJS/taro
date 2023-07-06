export interface IHarmonyConfig {
  /** Harmony 项目地址 */
  projectPath: string

  /** hap 名
   * @default "entry"
   */
  hapName?: string

  /** 应用名称
   * @default "default"
   */
  name?: string

  /** 用于告诉 Taro 编译器需要抽取的公共文件 */
  commonChunks?: string[] | ((commonChunks: string[]) => string[])

  /** Harmony 编译过程的相关配置 */
  compile?: {
    exclude?: any[]
    include?: any[]
  }
}
