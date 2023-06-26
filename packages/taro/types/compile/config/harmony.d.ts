export interface IHarmonyConfig {
  /** Harmony 项目地址 */
  projectPath: string

  /** hap 名
   * @default "entry"
   */
  hapName?: string

  /** jsFA 名
   * @default "default"
   */
  jsFAName?: string

  /** 用于告诉 Taro 编译器需要抽取的公共文件 */
  commonChunks?: string[] | ((commonChunks: string[]) => string[])
}
