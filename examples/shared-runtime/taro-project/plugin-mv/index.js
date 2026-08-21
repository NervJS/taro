const fs = require('fs-extra')
const path = require('path')

// 编译完成后，把 Taro 业务包产物搬进原生宿主 miniapp/pages/ 下（参照 miniapp-blended-project 布局）：
//   - 业务产物（app.js / taro-shared-sync.js / pages/... ）→ 宿主业务分包 pages/shared-runtime/
//   - 异步核 shared-async-v1/ → 与业务分包平级的宿主共享分包 pages/shared-async-v1/
// 二者平级，业务包同步核里 require.async('../shared-async-v1/index') 即可跨分包加载异步核
// （由 config.mini.sharedRuntimeAsyncRequest 烧定）。宿主 miniapp/app.json 手工注册这两个分包。
const SHARED_ASYNC_PREFIX = 'shared-async'

function findSharedAsyncDir (distRoot) {
  if (!fs.existsSync(distRoot)) return null
  return fs.readdirSync(distRoot).find(
    name => name === SHARED_ASYNC_PREFIX || name.startsWith(`${SHARED_ASYNC_PREFIX}-`)
  ) || null
}

export default (ctx) => {
  ctx.onBuildFinish(() => {
    const rootPath = path.resolve(__dirname, '../..')
    const pagesPath = path.join(rootPath, 'miniapp', 'pages')
    const outputPath = path.resolve(__dirname, '../dist')

    const businessDest = path.join(pagesPath, 'shared-runtime')
    if (fs.existsSync(businessDest)) fs.removeSync(businessDest)
    fs.copySync(outputPath, businessDest)

    // 异步核从业务分包目录抽出，移到与业务分包平级的 pages/shared-async-v1/
    const asyncDirName = findSharedAsyncDir(businessDest)
    if (asyncDirName) {
      const asyncDest = path.join(pagesPath, asyncDirName)
      if (fs.existsSync(asyncDest)) fs.removeSync(asyncDest)
      fs.moveSync(path.join(businessDest, asyncDirName), asyncDest)
      console.log(`拷贝结束！业务 -> ${businessDest}，异步核 -> ${asyncDest}`)
    } else {
      console.log(`拷贝结束！业务 -> ${businessDest}（未发现 shared-async 分包）`)
    }
  })
}
