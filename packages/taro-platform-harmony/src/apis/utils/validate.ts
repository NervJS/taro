import { isArray, isNull, isObject, isString } from '@tarojs/shared'

type JSTypes = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'bigint' | 'symbol' | 'array' | 'object' | 'function'

type NormalParamSchema = string[]
type ObjectParamSchema = Record<string, string>

type Schema = NormalParamSchema | ObjectParamSchema

interface ValidateParams {
  <T>(name: string, params: any, schema: Schema): asserts params is T
}

export function shouldBeObject (target: unknown) {
  if (target && typeof target === 'object') return { flag: true }
  return {
    flag: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

interface IParameterErrorParam {
  name?: string
  para?: string
  correct?: string
  wrong?: unknown
  level?: 'warn' | 'error' | 'log' | 'info' | 'debug'
}
export function getParameterError ({ name = '', para, correct, wrong, level = 'error' }: IParameterErrorParam) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name ? `${name}:fail ` : ''}parameter ${level}: ${parameter} should be ${correct} instead of ${errorType}`
}

export function upperCaseFirstLetter (string: string): string {
  if (!isString(string)) return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

function getType (param: string): JSTypes {
  if (isNull(param)) {
    return 'null'
  } else if (isArray(param)) {
    return 'array'
  } else {
    return typeof param
  }
}

export function assertType (target: any, type: string, methodName: string, paramName?: string) {
  const correct = upperCaseFirstLetter(type)
  if (correct !== upperCaseFirstLetter(getType(target))) {
    const err = getParameterError({ name: methodName, para: paramName, correct, wrong: target })
    throw new Error(err)
  }
}

/**
 * 用于校验方法的参数类型
 * @param name 方法名称
 * @param params [array|object] 当前参数
 * @param schema [array|object] 参数类型规范
 * @example
 * ```js
 * // 例子一：
 * validateParams(methodA, [key], [string])
 * // 例子二：
 * validateParams(methodB, { key: 123 }, { key: number })
 * ```
 * @todo 校验可选参数
 */
export const validateParams: ValidateParams = function (name, params, schema) {
  if (isArray(schema) && isString(schema[0])) {
    schema.forEach((correctType, index) => assertType(params[index], correctType, name, `[${index}]`))
  } else if (isObject(schema)) {
    const optionsSchema = schema

    assertType(params, 'object', name)
    for (const key in optionsSchema) {
      assertType(params[key], optionsSchema[key], name, key)
    }
  }
}
