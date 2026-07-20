/**
 * @tarojs/project-graph — dev-time 文件监听（任务 5）
 *
 * 复用 @tarojs/helper re-export 的 chokidar（不新增依赖，符合"与 vite/webpack
 * 共用 watcher 生态、不重复造底层能力"）。监听源码目录（sourceRoot，默认 src/，
 * 随 kernel.initialConfig.sourceRoot 可变）与 config/ 下的源文件变更，
 * 防抖后回调，由调用方重建图并通知订阅者。
 *
 * 仅监听源码目录与 config/；node_modules 在监听层通过 ignored 正则屏蔽（§3.5）。
 */

import * as path from 'node:path'

import { chokidar } from '@tarojs/helper'

/** 监听句柄。 */
export interface Watcher {
  close: () => void
}

/** 触发重建的防抖间隔（ms）。 */
const DEBOUNCE_MS = 100

/**
 * 启动对工程源码目录与 config/ 的监听。
 *
 * @param appPath 工程根
 * @param sourceRoot 源码目录（<root>/<sourceRoot>，默认 <root>/src）
 * @param onChange 防抖后回调，传入本批变更的文件路径
 */
export function startWatch(
  appPath: string,
  sourceRoot: string,
  onChange: (changedPaths: string[]) => void,
): Watcher {
  const configDir = path.join(appPath, 'config')
  const watcher = chokidar.watch([sourceRoot, configDir], {
    ignoreInitial: true,
    ignored: /(^|[/\\])node_modules([/\\]|$)/,
  })

  let pending: string[] = []
  let timer: ReturnType<typeof setTimeout> | undefined
  // chokidar 有初始扫描窗口：watcher 创建后到 'ready' 之前，正在建立底层监听。
  // 此窗口内订阅方做的**真实**变更，可能因底层监听尚未就位而不被 chokidar 感知（丢事件）。
  // 故用 ready 门控：ready 前发生的变更先缓冲，ready 到来时若有缓冲则立即冲洗一次；
  // 保证「订阅后立刻改文件」这类紧邻变更不丢首个事件（dev 长驻场景变更间隔通常远超
  // 该窗口、不受影响，但监听是公开能力，紧邻变更也应可靠）。
  let ready = false

  const flush = (): void => {
    const changed = pending
    pending = []
    timer = undefined
    if (changed.length > 0) onChange(changed)
  }

  const scheduleFlush = (): void => {
    if (timer != null) clearTimeout(timer)
    timer = setTimeout(flush, DEBOUNCE_MS)
  }

  const onEvent = (filePath: string): void => {
    pending.push(filePath)
    // ready 前只缓冲、不排期；ready 事件到来时统一冲洗，避免窗口内变更丢失。
    if (ready) scheduleFlush()
  }

  watcher.on('add', onEvent)
  watcher.on('change', onEvent)
  watcher.on('unlink', onEvent)
  watcher.on('ready', () => {
    ready = true
    if (pending.length > 0) scheduleFlush()
  })
  // 必须监听 error：chokidar 的 FSWatcher 继承 EventEmitter，emit 'error'（如
  // EMFILE / ENOSPC / EPERM）时若无监听者，Node 会 throw 并崩溃宿主进程（本库常
  // 驻于 taro-pilot 等控制面）。监听层错误吞掉即可，不应中断宿主。
  watcher.on('error', () => {})

  return {
    close: () => {
      if (timer != null) clearTimeout(timer)
      // chokidar close 返回 Promise；关闭是 best-effort，吞掉 rejection 即可
      watcher.close().catch(() => {})
    },
  }
}
