function inlineStyle (style) {
  let res = ''
  for (let attr in style) res += `${attr}: ${style[attr]};`
  if (res.includes('display: flex;')) res += 'display: -webkit-box;display: -webkit-flex;'
  return res
}

function errorHandler (fail, complete) {
  return function (res) {
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
  }
}

function getParameterError (name, para, correct, wrong) {
  return `${name}: fail parameter error: parameter.${para} should be ${correct} instead of ${wrong}`
}

export { inlineStyle, errorHandler, getParameterError }
