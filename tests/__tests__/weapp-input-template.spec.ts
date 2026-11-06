import { recursiveMerge } from '@tarojs/helper'
import { getComponentsAlias } from '@tarojs/shared'

import registerWeapp, { Weapp } from '../../packages/taro-platform-weapp/src/index'

async function getInputCursorBinding (renderer?: 'skyline' | 'webview') {
  let build: (args: any) => Promise<void>
  let updateAppConfig: (args: any) => void
  let program: Weapp

  jest.spyOn(Weapp.prototype, 'start').mockImplementation(async function () {
    program = this
    this.modifyTemplate()
    updateAppConfig({ appConfig: { renderer } })
  })

  registerWeapp({
    helper: { recursiveMerge },
    registerPlatform: ({ fn }) => { build = fn },
    modifyAppConfig: (callback) => { updateAppConfig = callback }
  } as any, {})

  await build!({ config: {} })

  const template = program!.template
  template.componentsAlias = getComponentsAlias(template.internalComponents)
  const binding = template.createMiniComponents(template.internalComponents).input['cursor-color']
  template.baseLevel = 2
  const markup = template.buildTemplate({
    includes: new Set(['input']),
    exclude: new Set(),
    thirdPartyComponents: new Map(),
    includeAll: false
  })
  return { binding, markup }
}

describe('WeChat input cursor color template', () => {
  afterEach(() => jest.restoreAllMocks())

  test('uses green for empty or removed values when the app config enables Skyline', async () => {
    const result = await getInputCursorBinding('skyline')
    expect(result.binding).toBe("i.p6||'#07c160'")
    expect(result.markup).toContain('cursor-color="{{i.p6||\'#07c160\'}}"')
  })

  test('keeps WebView and unspecified renderer behavior after a Skyline build', async () => {
    await getInputCursorBinding('skyline')
    const webview = await getInputCursorBinding('webview')
    expect(webview.binding).toBe('i.p6')
    expect(webview.markup).toContain('cursor-color="{{i.p6}}"')
    expect((await getInputCursorBinding()).binding).toBe('i.p6')
  })

  test('updates a cached input template when the renderer configuration changes', async () => {
    let build: (args: any) => Promise<void>
    let updateAppConfig: (args: any) => void
    let program: Weapp
    const config = {
      includes: new Set(['input']),
      exclude: new Set<string>(),
      thirdPartyComponents: new Map<string, Set<string>>(),
      includeAll: false
    }
    jest.spyOn(Weapp.prototype, 'start').mockImplementation(async function () {
      program = this
      this.modifyTemplate()
    })
    registerWeapp({
      helper: { recursiveMerge },
      registerPlatform: ({ fn }) => { build = fn },
      modifyAppConfig: (callback) => { updateAppConfig = callback }
    } as any, {})
    await build!({ config: {} })
    const template = program!.template
    template.baseLevel = 2

    updateAppConfig!({ appConfig: { renderer: 'webview' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6}}"')
    updateAppConfig!({ appConfig: { renderer: 'skyline' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6||\'#07c160\'}}"')
    updateAppConfig!({ appConfig: { renderer: 'webview' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6}}"')
  })

  test('preserves a plugin-provided cursor default in non-Skyline builds', async () => {
    let build: (args: any) => Promise<void>
    let updateAppConfig: (args: any) => void
    let program: Weapp
    jest.spyOn(Weapp.prototype, 'start').mockImplementation(async function () {
      program = this
      this.modifyTemplate()
      this.template.internalComponents = {
        ...this.template.internalComponents,
        Input: { ...this.template.internalComponents.Input, 'cursor-color': "'#abcdef'" }
      }
    })
    registerWeapp({
      helper: { recursiveMerge },
      registerPlatform: ({ fn }) => { build = fn },
      modifyAppConfig: (callback) => { updateAppConfig = callback }
    } as any, {})
    await build!({ config: {} })
    const template = program!.template
    template.componentsAlias = getComponentsAlias(template.internalComponents)
    template.baseLevel = 2
    const config = {
      includes: new Set(['input']),
      exclude: new Set<string>(),
      thirdPartyComponents: new Map<string, Set<string>>(),
      includeAll: false
    }

    updateAppConfig!({ appConfig: { renderer: 'webview' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6||\'#abcdef\'}}"')
    updateAppConfig!({ appConfig: { renderer: 'skyline' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6||\'#07c160\'}}"')
    updateAppConfig!({ appConfig: { renderer: 'webview' } })
    expect(template.buildTemplate(config)).toContain('cursor-color="{{i.p6||\'#abcdef\'}}"')
  })
})
