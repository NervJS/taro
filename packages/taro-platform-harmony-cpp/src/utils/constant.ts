import { version } from '../../package.json'

export const PKG_NAME = '@jd-oh/taro_cpp_library'

export const PKG_VERSION = version

export const PROJECT_DEPENDENCIES_NAME = [
]

export const PKG_DEPENDENCIES = {
}

export const RAWFILE_FOLDER = 'resources/rawfile'
export const RAWFILE_NAME_PREFIX = 'taro_gen_'
export const genRawFileName = (name: string) => `${RAWFILE_NAME_PREFIX}${name}`.replace(/[./*-]/g, '_')
