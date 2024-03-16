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

import type { PLATFORM_TYPE } from '@tarojs/shared'
import type { Compiler, LibraryOptions } from 'webpack'
import type { ContainerReferencePluginOptions, ModuleFederationPluginOptions } from 'webpack/types'

const PLUGIN_NAME = 'TaroModuleFederationPlugin'

interface IParams {
  deps: CollectedDeps
  env: string
  isBuildPlugin?: boolean
  platformType: PLATFORM_TYPE
  remoteAssets?: Record<'name', string>[]
  runtimeRequirements: Set<string>
}

export default class TaroModuleFederationPlugin extends ModuleFederationPlugin {
  private deps: IParams['deps']
  private isBuildPlugin: IParams['isBuildPlugin']
  private remoteAssets: IParams['remoteAssets']
  private runtimeRequirements: IParams['runtimeRequirements']

  protected _options: ModuleFederationPluginOptions
  protected _Library: LibraryOptions

  constructor (options: ModuleFederationPluginOptions, private params: IParams) {
    super(options)

    this.deps = params.deps
    this.isBuildPlugin = params.isBuildPlugin || false
    this.remoteAssets = params.remoteAssets || []
    this.runtimeRequirements = params.runtimeRequirements
    this._Library = { type: 'var', name: options.name }
  }

  /** Apply the plugin */
  apply (compiler: Compiler) {
    const { SharePlugin } = compiler.webpack.sharing
    const { _options: options } = this
    const library = options.library || this._Library
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
            platformType: this.params.platformType,
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
            platformType: this.params.platformType,
            remoteAssets: this.remoteAssets,
            isBuildPlugin: this.isBuildPlugin,
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
