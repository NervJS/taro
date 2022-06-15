/**
 * Modify from https://github.com/webpack/webpack/blob/main/lib/container/ModuleFederationPlugin.js
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
*/
import _ from 'lodash'
import { Compiler, container, sharing } from 'webpack'
import isValidExternalsType from 'webpack/schemas/plugins/container/ExternalsType.check.js'
import type { ContainerReferencePluginOptions, ModuleFederationPluginOptions } from 'webpack/types'

import { CollectedDeps } from '../constant'
import TaroContainerPlugin from './TaroContainerPlugin'
import TaroContainerReferencePlugin from './TaroContainerReferencePlugin'

const { ModuleFederationPlugin } = container
const { SharePlugin } = sharing

const PLUGIN_NAME = 'TaroModuleFederationPlugin'

export default class TaroModuleFederationPlugin extends ModuleFederationPlugin {
  private deps
  private remoteAssets
  private runtimeRequirements

  protected _options: ModuleFederationPluginOptions

  constructor (options: ModuleFederationPluginOptions, deps: CollectedDeps, remoteAssets: Record<'name', string>[] = [], runtimeRequirements: Set<string>) {
    super(options)

    this.deps = deps
    this.remoteAssets = remoteAssets
    this.runtimeRequirements = runtimeRequirements
  }

  /** Apply the plugin */
  apply (compiler: Compiler) {
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
          this.runtimeRequirements
        ).apply(compiler)
      }
      if (!_.isEmpty(remotes)) {
        const opt: ContainerReferencePluginOptions = {
          remoteType,
          remotes
        }
        new TaroContainerReferencePlugin(
          opt,
          this.deps,
          this.remoteAssets,
          this.runtimeRequirements
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
