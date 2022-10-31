import TaroContainerEntryModule from './TaroContainerEntryModule'

import type { Compilation } from 'webpack'

const ContainerEntryModuleFactory = require('webpack/lib/container/ContainerEntryModuleFactory')

export default class TaroContainerEntryModuleFactory extends ContainerEntryModuleFactory implements MapValue<Compilation['dependencyFactories']> {
  create (data, callback) {
    const dep = data?.dependencies[0]
    callback(null, {
      module: new TaroContainerEntryModule(dep.name, dep.exposes, dep.shareScope)
    })
  }
}
