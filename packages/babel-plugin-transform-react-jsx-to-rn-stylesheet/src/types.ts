import { PluginPass } from 'babel__core'

export interface PluginOptions {
  isCSSModule?: boolean

}

export interface ConvertPluginPass extends PluginPass {
  file: any
  opts: PluginOptions | undefined
}
