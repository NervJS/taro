import * as path from 'path'
import { NODE_MODULES_REG } from '../utils/constants'

const PLUGIN_NAME = 'ResolverPlugin'

export default class ResolverPlugin {
  constructor (source, target) {
    this.source = source
    this.target = target
  }

  apply (resolver) {
    const source = resolver.getHook(this.source)
    const target = resolver.ensureHook(this.target)
    source.tapAsync(PLUGIN_NAME, (request, resolveContext, callback) => {
      const { issuer } = request.context
      if (issuer && NODE_MODULES_REG.test(issuer)) {
        const issuerArr = issuer.split(path.sep)
        const lastNodeModulesIndex = issuerArr.lastIndexOf('node_modules')
        const pkgName = request.descriptionFileData.name
        issuerArr.splice(lastNodeModulesIndex + 1, pkgName.split('/').length, pkgName.replace(/\//g, path.sep))
        const newIssuer = issuerArr.join(path.sep)
        request.context.issuer = newIssuer
      }
      resolver.doResolve(target, request, null, resolveContext, callback)
    })
  }
}
