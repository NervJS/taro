export function dynamicRecursive (component, param, data) {
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
          fn: `dy_${paramItem.subscript}_${paramItem.name}${index}`,
          body: (function (d) {
            return Object.assign({
              $name: `dy_${paramItem.subscript}_${paramItem.name}${index}`
            }, paramItem.args && paramItem.args.call(component, d, index))
          })(d)
        }
        if (paramItem.children && paramItem.children.length) {
          res.children = dynamicRecursive(component, paramItem.children, d)
        }
        return res
      })
    } else if (paramItem.children && paramItem.children.length) {
      inData.map((d, index) => {
        res.children = dynamicRecursive(component, paramItem.children, d)
      })
    }
    return res
  })
}
