import { describe, expect, it } from 'vitest'

import { buildRootStyleImport, rewriteRootRequirePath } from '../src/utils/webpack'

// H:subPackageIndie 与共享运行时兼容——app.js 搬到 ${mainPackageRoot}/app.js(更深目录)后,
// TaroInjectSyncCorePlugin 注入的 require("./taro-shared-sync")(按根级 chunk-id 'app' 算)相对路径失效,
// 需按目标深度重算。rewriteRootRequirePath 是纯路径逻辑,fromId 语义同 addRequireToSource:
// fromId 是"文件路径"(chunk-id),promoteRelativePath 会消掉 basename 那一层多出的 ..。
// 调用方(SubPackageIndiePlugin.rewriteSyncCoreRequirePath)传的是 `${mainPackageRoot}/app`,
// 本测试按同样约定传入,验证各深度产出正确。
const SYNC = 'taro-shared-sync'
// 模拟 TaroInjectSyncCorePlugin 注入后的 app.js 原始形态(根级)
const APP_JS = 'require("./taro-shared-sync");\n(wx["webpackJsonp"]=wx["webpackJsonp"]||[]).push([[0],{}]);'

describe('H:rewriteRootRequirePath —— subPackageIndie 共享运行时同步核 require 路径重写', () => {
  it('mainPackageRoot 深度 3(官方示例 pages/order/index)→ 产物 pages/order/index/app.js → ../../../taro-shared-sync', () => {
    // 调用方传 `${root}/app` 作为 fromId(产物 chunk-id 等价物)
    const out = rewriteRootRequirePath(APP_JS, 'pages/order/index/app', SYNC)
    expect(out).toContain('require("../../../taro-shared-sync")')
    expect(out).not.toContain('require("./taro-shared-sync")')
  })

  it('mainPackageRoot 深度 1(pages)→ 产物 pages/app.js → ../taro-shared-sync', () => {
    const out = rewriteRootRequirePath(APP_JS, 'pages/app', SYNC)
    expect(out).toContain('require("../taro-shared-sync")')
    expect(out).not.toContain('require("./taro-shared-sync")')
  })

  it('mainPackageRoot 单段(app-main,罕见)→ 产物 app-main/app.js → ../taro-shared-sync', () => {
    const out = rewriteRootRequirePath(APP_JS, 'app-main/app', SYNC)
    expect(out).toContain('require("../taro-shared-sync")')
  })

  it('根级 fromId=app(注入端原始形态,不搬迁)→ 保持 ./taro-shared-sync(自洽性:重写幂等)', () => {
    // 证明算法与注入端 addRequireToSource(id='app')一致:根级重写回本身,不破坏未搬迁的产物
    const out = rewriteRootRequirePath(APP_JS, 'app', SYNC)
    expect(out).toContain('require("./taro-shared-sync")')
  })

  it('多次出现同一 require 全部替换(split/join 而非只替首个)', () => {
    const twice = 'require("./taro-shared-sync");x();require("./taro-shared-sync");'
    const out = rewriteRootRequirePath(twice, 'pages/a/b/app', SYNC)
    expect(out.match(/require\("\.\.\/\.\.\/\.\.\/taro-shared-sync"\)/g)?.length).toBe(2)
    expect(out).not.toContain('require("./taro-shared-sync")')
  })

  it('源码不含目标 require 时原样返回(不误伤、不抛错)', () => {
    const unrelated = 'console.log("no sync core here");'
    expect(rewriteRootRequirePath(unrelated, 'pages/order/index/app', SYNC)).toBe(unrelated)
  })

  it('精确匹配:不误伤含 target 名但非 require("./target") 形态的内容', () => {
    const withNoise = '/* taro-shared-sync loader */\nvar x="taro-shared-sync";require("./taro-shared-sync");'
    const out = rewriteRootRequirePath(withNoise, 'pages/x/app', SYNC)
    expect(out).toContain('/* taro-shared-sync loader */')
    expect(out).toContain('var x="taro-shared-sync"')
    // pages/x/app 作为文件路径 → 目录 pages/x → 2 级上溯
    expect(out).toContain('require("../../taro-shared-sync")')
  })
})

// subPackageIndie 把 app 样式随 runtime chunks 落在归一化 mainPackageRoot(normalizeIndieRoot 砍 /index),
// 页面 wxss @import app 样式需按页面 wxss 目录到 app 样式产物重算相对路径(修复固有 bug:硬编码 ./app)。
describe('H:buildRootStyleImport —— subPackageIndie mainPackageRoot 页面 @import app 样式路径', () => {
  it('页面比 app 样式深一级(pages/order/index/index.wxss → pages/order/app.wxss)→ ../app.wxss', () => {
    // 官方示例结构:mainPackageRoot=pages/order/index 归一化为 pages/order,页面产物在 pages/order/index/index.wxss
    const stmt = buildRootStyleImport('pages/order/index/index.wxss', 'pages/order/app.wxss')
    expect(stmt).toBe('@import "../app.wxss";\n')
  })

  it('页面与 app 样式同级(pages/order/index.wxss → pages/order/app.wxss)→ ./app.wxss', () => {
    const stmt = buildRootStyleImport('pages/order/index.wxss', 'pages/order/app.wxss')
    expect(stmt).toBe('@import "./app.wxss";\n')
  })

  it('页面深两级(a/b/c/index.wxss 目录 a/b/c → a/app.wxss)→ ../../app.wxss', () => {
    const stmt = buildRootStyleImport('a/b/c/index.wxss', 'a/app.wxss')
    expect(stmt).toBe('@import "../../app.wxss";\n')
  })

  it('alipay 样式扩展名(.acss)一致工作', () => {
    const stmt = buildRootStyleImport('pages/order/index/index.acss', 'pages/order/app.acss')
    expect(stmt).toBe('@import "../app.acss";\n')
  })
})
