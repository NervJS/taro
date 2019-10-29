const Bundler = require('scss-bundle').Bundler

/**
 * Return bundled sass content.
 * 
 * @param {string} url Absolute file path.
 * @param {(string | undefined)} projectDirectory Absolute project location, where node_modules are located. Used for resolving tilde imports.
 * @returns Bundle result.
 */
async function getBundleContent(url, projectDirectory = undefined) {
  let bundler = undefined
  if (projectDirectory) {
    bundler = new Bundler(undefined, projectDirectory)
  } else {
    bundler = new Bundler()
  }
  if (!bundler) {
    throw new ReferenceError(`'bundler' is not defined.`)
  }
  const res = await bundler.Bundle(url)
  return res
}

module.exports = getBundleContent
