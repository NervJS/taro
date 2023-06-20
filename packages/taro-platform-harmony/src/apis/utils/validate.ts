import { isArray, isNull, isObject, isString } from '@tarojs/shared'

type JSTypes = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'bigint' | 'symbol' | 'array' | 'object' | 'function'

type NormalParamSchema = string[]
type ObjectParamSchema = Record<string, string>

type Schema = NormalParamSchema | ObjectParamSchema

interface ValidateParams {
  <T>(name: string, params: any, schema: Schema): asserts params is T
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

function getErrorMessage (correctType: string, wrongType: string, methodName: string, paramName?: string): string {
  const parameter = paramName ? `parameter.${paramName}` : 'parameter'
  return `${methodName}:fail parameter error: ${parameter} should be ${correctType} instead of ${wrongType}`
}

export function assertType (target: any, type: string, methodName: string, paramName?: string) {
  const currentType = upperCaseFirstLetter(getType(target))
  const correctType = upperCaseFirstLetter(type)
  if (currentType !== correctType) {
    const err = getErrorMessage(correctType, currentType, methodName, paramName)
    throw new Error(err)
  }
}

const isNormalSchema = function (schema: Schema): schema is NormalParamSchema {
  return isArray(schema) && isString(schema[0])
}

const isObjectSchema = function (schema: Schema): schema is ObjectParamSchema {
  return isObject(schema)
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
  if (isNormalSchema(schema)) {
    schema.forEach((correctType, index) => assertType(params[index], correctType, name, `[${index}]`))
  } else if (isObjectSchema(schema)) {
    const optionsSchema = schema

    assertType(params, 'object', name)
    for (const key in optionsSchema) {
      assertType(params[key], optionsSchema[key], name, key)
    }
  }
}
