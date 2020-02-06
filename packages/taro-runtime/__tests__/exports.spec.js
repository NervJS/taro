describe('style', () => {
  const runtime = require('../dist/runtime.esm')

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('bom', () => {
    const window = runtime.window
    expect(window).not.toBeUndefined()
    expect(window.navigator).not.toBeUndefined()
    expect(window.document).not.toBeUndefined()
    expect(runtime.document).toBe(window.document)
    expect(runtime.navigator).toBe(window.navigator)
  })

  it('dom', () => {
    expect(runtime.TaroElement).not.toBeUndefined()
    expect(runtime.TaroNode).not.toBeUndefined()
    expect(runtime.TaroText).not.toBeUndefined()
  })

  it('event', () => {
    expect(runtime.createEvent).not.toBeUndefined()
    expect(runtime.TaroEvent).not.toBeUndefined()
  })

  it('dsl', () => {
    expect(runtime.createComponentConfig).not.toBeUndefined()
    expect(runtime.createPageConfig).not.toBeUndefined()
    expect(runtime.createReactApp).not.toBeUndefined()
    expect(runtime.createReactApp).not.toBeUndefined()
  })
})
