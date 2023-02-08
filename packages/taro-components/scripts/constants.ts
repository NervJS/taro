import path from 'path'

export const MINI_APP_TYPES = ['weapp', 'alipay', 'swan', 'tt', 'qq', 'jd'] as const
export const TYPES_DIR = path.join(process.cwd(), 'types')
