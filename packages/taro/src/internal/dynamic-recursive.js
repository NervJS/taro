export function dynamicRecursive (component, param, data, stateName) {
  data = data || []
  return param.map(paramItem => {
    const inData = paramItem.subscript ? data[paramItem.subscript] || [] : data
    const res = {
      name: paramItem.name || '',
      path: paramItem.path || '',
      subscript: paramItem.subscript
    }
    res.components = []
    if (res.name) {
      res.components = inData.map((d, index) => {
        const res = {
          fn: `dy_${stateName}_${paramItem.subscript}_${paramItem.name}${index}`,
          body: (function (d) {
            return Object.assign({
              $name: `dy_${stateName}_${paramItem.subscript}_${paramItem.name}${index}`
            }, paramItem.args && paramItem.args.call(component, d, index))
          })(d)
        }
        if (paramItem.children && paramItem.children.length) {
          res.children = dynamicRecursive(component, paramItem.children, d, stateName)
        }
        return res
      })
    } else if (paramItem.children && paramItem.children.length) {
      inData.map((d, index) => {
        res.children = dynamicRecursive(component, paramItem.children, d, stateName)
      })
    }
    return res
  })
}
