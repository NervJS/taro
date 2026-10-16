import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'

import { describe, expect, it } from 'vitest'

import { install } from '../src/shared-runtime/app-shim'

const provider = readFileSync(resolve(__dirname, '../src/shared-runtime/async-provider.js'), 'utf8')

function activate (shared: any) {
  const reactDom = {
    createRoot: (container: any) => ({ render: (element: any) => { container.element = element } }),
    hydrateRoot: () => ({}),
    createPortal: (element: any) => element
  }
  const modules: Record<string, any> = {
    '@tarojs/react': reactDom,
    '@tarojs/plugin-framework-react/dist/runtime': { createReactApp: () => ({}) },
    '@tarojs/taro': { showToast () {} },
    'react-reconciler': {},
    scheduler: {}
  }
  runInNewContext(provider, {
    module: { exports: {} },
    __TARO_SHARED_GLOBAL__: '__testShared',
    __TARO_GLOBAL_OBJECT__: { __testShared: shared },
    __TARO_RUNTIME_VERSION__: 'test-v1',
    require: (name: string) => {
      if (!(name in modules)) throw new Error(`Unexpected provider dependency: ${name}`)
      return modules[name]
    }
  })
  shared.__activateAsync()
}

function installSync () {
  const shared: any = { '@tarojs/runtime': {}, __rtVersion: 'test-v1' }
  install(shared, { app: null })
  return shared
}

describe('react-dom/client early external reference', () => {
  it('a client module cached before async activation can create and render a root after activation', () => {
    const shared = installSync()
    const cachedClient = shared['react-dom/client']
    activate(shared)
    const container: any = {}

    cachedClient.createRoot(container).render('modal')
    expect(container.element).toBe('modal')
    expect(shared['react-dom/client']).toBe(cachedClient)
  })

  it('async activation still supplies late client imports when paired with an older sync core', () => {
    const shared = installSync()
    delete shared['react-dom/client']
    activate(shared)
    const container: any = {}

    shared['react-dom/client'].createRoot(container).render('late-modal')
    expect(container.element).toBe('late-modal')
  })
})
