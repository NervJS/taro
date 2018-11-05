export function generateUnSupportApi (errText, fnNames) {
  const res = {}
  fnNames.forEach((fnName) => {
    res[fnName] = function () {
      throw new Error(`${errText} ##  ${JSON.stringify(arguments)}`)
    }
  })
  return res
}
