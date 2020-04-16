// https://github.com/alexreardon/memoize-one#readme

function areInputsEqual (newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false
  }
  for (let i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false
    }
  }
  return true
}

export function memoizeOne (resultFn, isEqual) {
  // eslint-disable-next-line no-void
  if (isEqual === void 0) { isEqual = areInputsEqual }
  let lastThis
  let lastArgs = []
  let lastResult
  let calledOnce = false
  function memoized () {
    const newArgs = []
    for (let _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i]
    }
    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult
    }
    lastResult = resultFn.apply(this, newArgs)
    calledOnce = true
    lastThis = this
    lastArgs = newArgs
    return lastResult
  }
  return memoized
}
