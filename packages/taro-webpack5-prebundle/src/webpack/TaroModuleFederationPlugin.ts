/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ModuleFederationPlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
*/
import _ from 'lodash'
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin'
import isValidExternalsType from 'webpack/schemas/plugins/container/ExternalsType.check.js'

import { CollectedDeps } from '../utils/constant'
import TaroContainerPlugin from './TaroContainerPlugin'
import TaroContainerReferencePlugin from './TaroContainerReferencePlugin'

import type { Compiler } from 'webpack'
import type { ContainerReferencePluginOptions, ModuleFederationPluginOptions } from 'webpack/types'

const PLUGIN_NAME = 'TaroModuleFederationPlugin'

interface IParams {
  deps: CollectedDeps
  env: string
  remoteAssets?: Record<'name', string>[]
  runtimeRequirements: Set<string>
}

export default class TaroModuleFederationPlugin extends ModuleFederationPlugin {
  private deps: IParams['deps']
  private remoteAssets: IParams['remoteAssets']
  private runtimeRequirements: IParams['runtimeRequirements']

  protected _options: ModuleFederationPluginOptions

  constructor (options: ModuleFederationPluginOptions, private params: IParams) {
    super(options)

    this.deps = params.deps
    this.remoteAssets = params.remoteAssets || []
    this.runtimeRequirements = params.runtimeRequirements
  }

  /** Apply the plugin */
  apply (compiler: Compiler) {
    const { SharePlugin } = compiler.webpack.sharing
    const { _options: options } = this
    const library = options.library || { type: 'var', name: options.name }
    const remoteType = options.remoteType ||
      (options.library && isValidExternalsType(options.library.type)
        ? (options.library.type as ContainerReferencePluginOptions['remoteType'])
        : 'script')
    const enabledLibraryTypes = compiler.options.output.enabledLibraryTypes
    if (library && !enabledLibraryTypes?.includes(library.type)) {
      enabledLibraryTypes?.push(library.type)
    }
    compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {
      const { exposes, filename, name, remotes = [], runtime, shared, shareScope } = options
      if (!_.isEmpty(exposes)) {
        new TaroContainerPlugin(
          {
            name,
            library,
            filename,
            runtime,
            exposes
          },
          {
            env: this.params.env,
            runtimeRequirements: this.runtimeRequirements
          }
        ).apply(compiler)
      }
      if (!_.isEmpty(remotes)) {
        const opt: ContainerReferencePluginOptions = {
          remoteType,
          remotes
        }
        new TaroContainerReferencePlugin(
          opt,
          {
            deps: this.deps,
            env: this.params.env,
            remoteAssets: this.remoteAssets,
            runtimeRequirements: this.runtimeRequirements
          }
        ).apply(compiler)
      }
      if (shared) {
        new SharePlugin({
          shared,
          shareScope
        }).apply(compiler)
      }
    })
  }
}
