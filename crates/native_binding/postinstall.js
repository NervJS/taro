const { execSync } = require('child_process')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { join, resolve } = require('path')
const { platform, arch } = require('os')

const { platformArchTriples } = require('@napi-rs/triples')

const PLATFORM_NAME = platform()
const ARCH_NAME = arch()

if (process.env.npm_config_build_from_source || process.env.BUILD_TARO_FROM_SOURCE) {
  let libExt
  let dylibName = 'taro_binding'
  switch (PLATFORM_NAME) {
    case 'darwin':
      libExt = '.dylib'
      dylibName = `lib${dylibName}`
      break
    case 'win32':
      libExt = '.dll'
      break
    case 'linux':
    case 'freebsd':
    case 'openbsd':
    case 'android':
    case 'sunos':
      dylibName = `lib${dylibName}`
      libExt = '.so'
      break
    default:
      throw new TypeError('Operating system not currently supported or recognized by the build script')
  }
  execSync('cargo build --release', {
    stdio: 'inherit',
    env: process.env,
  })
  let dylibPath = join(__dirname, 'target', 'release', `${dylibName}${libExt}`)
  if (!existsSync(dylibPath)) {
    dylibPath = join(resolve(__dirname, '..', '..'), 'target', 'release', `${dylibName}${libExt}`)
  }
  const dylibContent = readFileSync(dylibPath)
  const triples = platformArchTriples[PLATFORM_NAME][ARCH_NAME]
  const tripe = triples[0]
  writeFileSync(join(__dirname, `taro.${tripe.platformArchABI}.node`), dylibContent)
}
