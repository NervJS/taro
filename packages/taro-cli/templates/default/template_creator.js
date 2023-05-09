function createWhenTs (params) {
  return !!params.typescript
}

const SOURCE_ENTRY = '/src'

const handler = {
  '/tsconfig.json': createWhenTs,
  '/types/global.d.ts': createWhenTs,
  '/types/vue.d.ts' ({ framework, typescript }) {
    return ['vue', 'vue3'].includes(framework) && !!typescript
  },
  '/src/pages/index/index.jsx' ({ pageName, pageDir, subPkg }) {
    pageDir = pageDir ? `${pageDir}/` : ''
    return {
      setPageName: `${SOURCE_ENTRY}/pages/${pageDir}${pageName}/index.jsx`,
      setSubPkgName: `${SOURCE_ENTRY}/${subPkg}/index.jsx`
    }
  },
  '/src/pages/index/index.css' ({ pageName, pageDir, subPkg }) {
    pageDir = pageDir ? `${pageDir}/` : ''
    return {
      setPageName: `${SOURCE_ENTRY}/pages/${pageDir}${pageName}/index.css`,
      setSubPkgName: `${SOURCE_ENTRY}/${subPkg}/index.css`
    }
  },
  '/src/pages/index/index.vue' ({ pageName, pageDir, subPkg }) {
    pageDir = pageDir ? `${pageDir}/` : ''
    return {
      setPageName: `${SOURCE_ENTRY}/pages/${pageDir}${pageName}/index.vue`,
      setSubPkgName: `${SOURCE_ENTRY}/${subPkg}/index.vue`
    }
  },
  '/src/pages/index/index.config.js' ({ pageName, pageDir, subPkg }) {
    pageDir = pageDir ? `${pageDir}/` : ''
    return {
      setPageName: `${SOURCE_ENTRY}/pages/${pageDir}${pageName}/index.config.js`,
      setSubPkgName: `${SOURCE_ENTRY}/${subPkg}/index.config.js`
    }
  }
}

const basePageFiles = [
  '/src/pages/index/index.jsx',
  '/src/pages/index/index.vue',
  '/src/pages/index/index.css',
  '/src/pages/index/index.config.js'
]

module.exports = {
  handler,
  basePageFiles
}
