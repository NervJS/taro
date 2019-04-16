// import { Permissions } from 'expo'
//
// export async function askAsyncPermissions (PermissionsType) {
//   const { status } = await Permissions.askAsync(PermissionsType)
//   return status
// }

function upperCaseFirstLetter (string) {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function getParameterError ({name = '', para, correct, wrong}) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

export function shouleBeObject (target) {
  if (target && typeof target === 'object') return {res: true}
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function successHandler (success, complete) {
  return function (res) {
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail, complete) {
  return function (res) {
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}
