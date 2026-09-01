const fs = require('fs-extra')
const path = require('path')

// native-components 场景：编译产物结构与 pages 模式不同
//   - 无 app.js / app.json / app.wxss(BuildNativePlugin 显式不生成)
//   - 每个组件是独立 chunk: dist/components/<name>/{index.js,index.wxml,index.json,index.wxss}
//   - 每个 chunk 顶部由 TaroInjectSyncCorePlugin(injectOnPage=true）注入 require('taro-shared-sync')
//   - shared-async-v1/ 与 taro-shared-sync.js 在根级
//
// 搬运布局（与 taro-project 复用同一 miniapp 宿主）:
//   dist/*                      → miniapp/pages/shared-native-comp/
//   dist/shared-async-v1/       → miniapp/pages/shared-async-v1/(同宿主已存在,幂等覆盖）
// 宿主原生页 pages/comp-host 通过 usingComponents 引本 native-comp。
const SHARED_ASYNC_PREFIX = 'shared-async'

function findSharedAsyncDir (root) {
  if (!fs.existsSync(root)) return null
  return fs.readdirSync(root).find(
    name => name === SHARED_ASYNC_PREFIX || name.startsWith(`${SHARED_ASYNC_PREFIX}-`)
  ) || null
}

export default (ctx) => {
  ctx.onBuildFinish(() => {
    // 仅在 native-components 子命令下搬运。ctx.runOpts._[1] === 'native-components' 是 CLI 分派标识。
    const isBuildNativeComp = ctx.runOpts._[1] === 'native-components'
    if (!isBuildNativeComp) return

    const rootPath = path.resolve(__dirname, '../..')
    const pagesPath = path.join(rootPath, 'miniapp', 'pages')
    const outputPath = path.resolve(__dirname, '../dist')

    const businessDest = path.join(pagesPath, 'shared-native-comp')
    if (fs.existsSync(businessDest)) fs.removeSync(businessDest)
    fs.copySync(outputPath, businessDest)

    // 异步核抽出到与业务分包平级,与 taro-project 的 plugin-mv 处理一致。
    // 若 taro-project 已先跑过,宿主 pages/shared-async-v1/ 已存在——两包共享该分包(异步核内容一致,
    // 幂等覆盖也无害)。若单独跑 native-comp-project,首次拷贝在此建立异步核分包。
    const asyncDirName = findSharedAsyncDir(businessDest)
    if (asyncDirName) {
      const asyncDest = path.join(pagesPath, asyncDirName)
      if (fs.existsSync(asyncDest)) fs.removeSync(asyncDest)
      fs.moveSync(path.join(businessDest, asyncDirName), asyncDest)
      console.log(`拷贝结束！业务 -> ${businessDest},异步核 -> ${asyncDest}`)
    } else {
      console.log(`拷贝结束！业务 -> ${businessDest}(未发现 shared-async 分包)`)
    }
  })
}
