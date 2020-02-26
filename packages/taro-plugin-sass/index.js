const sass = require('node-sass')
const getBundleContent = require('./bundler')

module.exports = function compileSass (content, file, config) {
  return new Promise(async (resolve, reject) => {
    let bundledContent = ''

    // when plugins.sass only configured resource property
    if (config.resource && !config.projectDirectory) {
      const { resource } = config
      try {
        if (typeof resource === 'string') {
          const res = await getBundleContent(resource)
          bundledContent += res.bundledContent
        }
        if (Array.isArray(resource)) {
          for (const url of resource) {
            const res = await getBundleContent(url)
            bundledContent += res.bundledContent
          }
        }
      } catch (e) {
        reject(e)
      }
    }

    // check resource & projectDirectory property
    // projectDirectory used for resolving tilde imports
    if (config.resource && config.projectDirectory) {
      const { resource, projectDirectory } = config
      try {
        if (typeof resource === 'string') {
          const res = await getBundleContent(resource, projectDirectory)
          bundledContent += res.bundledContent
        }
        if (Array.isArray(resource)) {
          for (const url of resource) {
            const res = await getBundleContent(url, projectDirectory)
            bundledContent += res.bundledContent
          }
        }
      } catch (e) {
        reject(e)
      }
    }

    if (config.data) {
      bundledContent += config.data
    }

    const opts = Object.assign({}, config, {
      file,
      data: bundledContent ? bundledContent + (content ? content : '') : content
    })

    let result
    try {
      result = sass.renderSync(opts)
    } catch (e) {
      reject(e)
    }
    resolve(result)
  })
}
