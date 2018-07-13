export function dynamicRecursive (component, param, data, uid) {
  data = data || []
  return param.map((paramItem, idx) => {
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
          fn: `dy_${uid}_${paramItem.subscript}_${paramItem.name}${index}_${idx}`,
          body: (function (d) {
            return Object.assign({
              $name: `dy_${uid}_${paramItem.subscript}_${paramItem.name}${index}`
            }, paramItem.args && paramItem.args.call(component, d, index))
          })(d)
        }
        if (paramItem.children && paramItem.children.length) {
          res.children = dynamicRecursive(component, paramItem.children, d, uid)
        }
        return res
      })
    } else if (paramItem.children && paramItem.children.length) {
      res.children = inData.map((d, index) => {
        return dynamicRecursive(component, paramItem.children, d, uid)
      })
    }
    return res
  })
}
