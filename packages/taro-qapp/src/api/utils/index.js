export function generateUnSupportApi (errText, fnNames) {
  const res = {}
  fnNames.forEach((fnName) => {
    res[fnName] = function () {
      throw new Error(errText)
    }
  })
  return res
}
