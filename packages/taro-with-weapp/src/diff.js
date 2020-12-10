/*eslint-disable*/
const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'

export function diff (current, pre) {
  const result = {}
  syncKeys(current, pre)
  _diff(current, pre, '', result)
  return result
}

function syncKeys (current, pre) {
  const stack = [];
  function _syncKeys ([current, pre]) {
    if (current === pre) return
    const rootCurrentType = type(current)
    const rootPreType = type(pre)
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
      // if(Object.keys(current).length >= Object.keys(pre).length){
      for (let key in pre) {
        const currentValue = current[key]
        if (currentValue === undefined) {
          current[key] = null
        } else {
          stack.push([currentValue, pre[key]])
        }
      }
      // }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
      if (current.length >= pre.length) {
        pre.forEach((item, index) => {
          stack.push([current[index], item])
        })
      }
    }
  }
  while (stack.length > 0) { _syncKeys(stack.shift()) }
}

function _diff (current, pre, path, result) {
  const stack = [];
  function __diff ([current, pre, path, result]) {
    if (current === pre) return
    const rootCurrentType = type(current)
    const rootPreType = type(pre)
    if (rootCurrentType == OBJECTTYPE) {
      if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
        setResult(result, path, current)
      } else {
        for (let key in current) {
          const currentValue = current[key]
          const preValue = pre[key]
          const currentType = type(currentValue)
          const preType = type(preValue)
          if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
            if (currentValue != pre[key]) {
              setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
            }
          } else if (currentType == ARRAYTYPE) {
            if (preType != ARRAYTYPE) {
              setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
            } else {
              if (currentValue.length < preValue.length) {
                setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
              } else {
                currentValue.forEach((item, index) => {
                  stack.push([item, preValue[index], (path == '' ? '' : path + '.') + key + '[' + index + ']', result])
                })
              }
            }
          } else if (currentType == OBJECTTYPE) {
            if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
              setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
            } else {
              for (let subKey in currentValue) {
                stack.push([currentValue[subKey], preValue[subKey], (path == '' ? '' : path + '.') + key + '.' + subKey, result])
              }
            }
          }
        }
      }
    } else if (rootCurrentType == ARRAYTYPE) {
      if (rootPreType != ARRAYTYPE) {
        setResult(result, path, current)
      } else {
        if (current.length < pre.length) {
          setResult(result, path, current)
        } else {
          current.forEach((item, index) => {
            stack.push([item, pre[index], path + '[' + index + ']', result])
          })
        }
      }
    } else {
      setResult(result, path, current)
    }
  }
  while (stack.length > 0) { __diff(stack.shift()) }
}

function setResult (result, k, v) {
  if (type(v) != FUNCTIONTYPE) {
    result[k] = v
  }
}

function type (obj) {
  return Object.prototype.toString.call(obj)
}
