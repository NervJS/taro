import * as t from '@babel/types'

import { appendTemplates as appendTemplatesDOM } from '../dom/template'
import { appendTemplates as appendTemplatesSSR } from '../ssr/template'
import { getRendererConfig, getTaroComponentsMap, registerImportMethod } from './utils'

// add to the top/bottom of the module.
export default (path) => {
  if (path.scope.data.events) {
    path.node.body.push(
      t.expressionStatement(
        t.callExpression(registerImportMethod(path, 'delegateEvents', getRendererConfig(path, 'dom').moduleName), [
          t.arrayExpression(Array.from(path.scope.data.events).map((e) => t.stringLiteral(e))),
        ])
      )
    )
  }
  if (path.scope.data.templates?.length) {
    const domTemplates = path.scope.data.templates.filter((temp) => temp.renderer === 'dom')
    const ssrTemplates = path.scope.data.templates.filter((temp) => temp.renderer === 'ssr')
    domTemplates.length > 0 && appendTemplatesDOM(path, domTemplates)
    ssrTemplates.length > 0 && appendTemplatesSSR(path, ssrTemplates)
  }

  const taroComponentsMap = getTaroComponentsMap(path)
  taroComponentsMap.clear()
}
