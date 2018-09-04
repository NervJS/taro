import * as template from 'babel-template'
import * as t from 'babel-types'

export const buildTemplate = (str: string) => template(str)().expression as t.Expression
