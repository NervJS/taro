import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

import { describe, expect, test } from 'vitest'

import { getAsyncRequest } from '../src/shared-runtime/build-shared-runtime'
import { createSharedRuntimeWaitSource } from '../src/utils/asyncSubPackageRuntime'

const GLOBAL_KEY = '__TARO_RT_ASYNC_V1__'

function loadProvider (globalObject: Record<string, any>) {
  const source = fs
    .readFileSync(path.resolve(__dirname, '../src/shared-runtime/async-provider.js'), 'utf8')
    .replace(/__TARO_GLOBAL_OBJECT__/g, '__wx')
    .replace(/__TARO_SHARED_GLOBAL__/g, JSON.stringify(GLOBAL_KEY))
    .replace(/__TARO_RUNTIME_VERSION__/g, '1')

  const context = vm.createContext({
    __wx: globalObject,
    console,
    Error,
    Object,
    Promise,
    module: { exports: {} },
    require: () => {
      throw new Error('unexpected require in readiness test')
    },
  })
  vm.runInContext(source, context)
  return globalObject[GLOBAL_KEY]
}

describe('shared runtime readiness', () => {
  test('占位对象未就绪时 activate 返回 false', () => {
    const wx: Record<string, any> = {}
    const shared = loadProvider(wx)
    expect(shared.__activateAsync()).toBe(false)
  })

  test('已激活时 activate 幂等返回 true', () => {
    const wx: Record<string, any> = {
      [GLOBAL_KEY]: {
        '@tarojs/runtime': {},
        '@tarojs/taro': {},
        __rtActivated: true,
      },
    }
    const shared = loadProvider(wx)
    expect(shared.__activateAsync()).toBe(true)
  })

  test('版本不一致时抛出明确错误', () => {
    const wx: Record<string, any> = {
      [GLOBAL_KEY]: {
        '@tarojs/runtime': {},
        '@tarojs/taro': {},
        __rtVersion: 0,
      },
    }
    const shared = loadProvider(wx)
    expect(() => shared.__activateAsync()).toThrow(/版本不一致/)
  })

  test('就绪门源码包含 pending / error / waiter 三个分支', () => {
    const Template = {
      indent: (value: string | string[]) =>
        Array.isArray(value) ? value.map(line => `  ${line}`) : `  ${value}`,
    }
    const source = createSharedRuntimeWaitSource(Template, {
      globalObject: 'wx',
      globalKey: GLOBAL_KEY,
    }).join('\n')

    expect(source).toContain(`wx[${JSON.stringify(GLOBAL_KEY)}]`)
    expect(source).toContain('__rtProviderState')
    expect(source).toContain('__rtProviderWaiters')
    expect(source).toContain('Promise.reject')
    expect(source).toContain('Promise.resolve')
  })

  test('async-only 模式 require.async 使用同级相对路径', () => {
    expect(getAsyncRequest({}, true)).toBe('./shared-async-v1/index')
  })

  test('indie 模式保持原有默认值', () => {
    expect(getAsyncRequest({}, false)).toBe('shared-async-v1/index')
  })
})
