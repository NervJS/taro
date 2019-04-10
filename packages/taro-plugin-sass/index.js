const sass = require('dart-sass')
const Bundler = require('scss-bundle').Bundler

module.exports = function compileSass (content, file, config) {
  return new Promise(async (resolve, reject) => {
    let bundledContent = ''
    // check resource & projectDirectory property
    // projectDirectory used for resolving tilde imports
    if (config.resource && config.projectDirectory) {
      const { resource, projectDirectory } = config
      const getBundleContent = async (url) => {
        const bundler = new Bundler(undefined, projectDirectory)
        const res = await bundler.Bundle(url)
        bundledContent += res.bundledContent
      }
      try {
        if (typeof resource === 'string') {
          await getBundleContent(resource)
        } else if (Array.isArray(resource)) {
          for (let url of resource) {
            await getBundleContent(url)
          }
        }
      } catch (e) {
        reject(e)
      }
    }
    const opts = Object.assign(config, {
      file,
      data: bundledContent ? bundledContent + content : content
    })
    var result
    try {
      result = sass.renderSync(opts)
    } catch (e) {
      reject(e)
    }
    resolve(result)
  })
}
