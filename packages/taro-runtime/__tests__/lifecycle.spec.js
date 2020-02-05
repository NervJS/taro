describe('data', () => {
  process.env.FRAMEWORK = 'react'
  const runtime = require('../dist/runtime.esm')
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('can addEventListener', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    div.addEventListener('tap', spy)
    const event = runtime.createEvent({ type: 'tap' }, div)
    // mini program event system will do this for us
    div.dispatchEvent(event)
  })
})
