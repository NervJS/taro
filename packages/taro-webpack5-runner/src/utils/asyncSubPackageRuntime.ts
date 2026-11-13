export interface SharedRuntimeGate {
  globalObject: string
  globalKey: string
}

/**
 * 生成业务异步 chunk 的共享运行时就绪门。
 *
 * 仅在 sharedRuntime 开启时注入；未开启时 AsyncSubPackagePlugin 不调用本函数，
 * 产物与旧版本保持一致。
 *
 * 状态机：
 *   - 没有 shared / 没有 __rtProviderState / ready → 立即 resolve
 *   - error → reject，错误向上传播，绝不挂起
 *   - pending → 进入 __rtProviderWaiters，由 entry.sync.js 的 __rtProviderSettle 统一 flush
 */
export function createSharedRuntimeWaitSource (Template: any, gate: SharedRuntimeGate): string[] {
  const globalRef = `${gate.globalObject}[${JSON.stringify(gate.globalKey)}]`

  return [
    'var waitSharedRuntime = function() {',
    Template.indent([
      `var shared = ${globalRef};`,
      'if (!shared || !shared.__rtProviderState || shared.__rtProviderState === "ready") return Promise.resolve();',
      'if (shared.__rtProviderState === "error") return Promise.reject(shared.__rtProviderError || new Error("[taro-shared] shared runtime provider failed to activate"));',
      'return new Promise(function(resolve, reject) {',
      Template.indent([
        '(shared.__rtProviderWaiters || (shared.__rtProviderWaiters = [])).push({ resolve: resolve, reject: reject });'
      ]),
      '});'
    ]),
    '};'
  ]
}
