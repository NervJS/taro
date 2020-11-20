// external tooling
import path from 'path'
import resol from 'resolve'
import { findVariant } from './index'

const moduleDirectories = ['web_modules', 'node_modules']

function resolveModule (id, opts) {
  return new Promise((resolve, reject) => {
    resol(id, opts, (err, filePath) => (err ? reject(err) : resolve(filePath)))
  })
}

export default function (id, base, options) {
  const paths = options.path

  const resolveOpts = {
    basedir: base,
    moduleDirectory: moduleDirectories.concat(options.addModulesDirectories),
    paths: paths,
    packageFilter: function processPackage (pkg) {
      if (pkg.style) pkg.main = pkg.style
      else if (!pkg.main || !/\.css$/.test(pkg.main)) pkg.main = 'index.css'
      return pkg
    },
    preserveSymlinks: false
  }

  const ext = path.extname(id)
  const exts = [
    // add the platform specific extension, first in the array to take precedence
    options.platform === 'android' ? '.android' + ext : '.ios' + ext,
    '.native' + ext,
    '.rn' + ext,
    ext
  ]
  const file = findVariant(path.basename(id, ext), exts, [base, ...paths])
  if (!file) {
    throw new Error(`
      Failed to find ${id}
      in [
    ${paths.join(',\n       ')}
  ]
    `)
  }
  const fileName = path.basename(file)

  return resolveModule(`./${fileName}`, resolveOpts)
    .catch(() => resolveModule(id, resolveOpts))
    .catch(() => {
      if (paths.indexOf(base) === -1) paths.unshift(base)

      throw new Error(
        `Failed to find '${id}'
  in [
    ${paths.join(',\n        ')}
  ]`
      )
    })
}
