import { getSelectedTextRange, hideKeyboard } from '../../src/api/device/keyboard'

afterEach(() => {
  document.body.innerHTML = ''
})

test.each([
  ['input', 0, 4],
  ['textarea', 0, 0],
  ['textarea', 2, 5],
] as const)('returns the range in a focused %s (%s to %s)', async (tag, start, end) => {
  const input = document.createElement(tag)
  input.value = 'Hello Taro'
  document.body.appendChild(input)
  input.focus()
  input.setSelectionRange(start, end)
  const success = jest.fn()
  const fail = jest.fn()
  const complete = jest.fn()
  const result = { errMsg: 'getSelectedTextRange:ok', start, end }

  await expect(getSelectedTextRange({ success, fail, complete })).resolves.toEqual(result)
  expect(success.mock.calls).toEqual([[result]])
  expect(complete.mock.calls).toEqual([[result]])
  expect(fail).not.toHaveBeenCalled()
})

test('rejects when a text input has lost focus', async () => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.focus()
  input.blur()
  await expect(getSelectedTextRange()).rejects.toEqual({
    errMsg: 'getSelectedTextRange:fail no focused input with a text selection'
  })
})

test('calls fail and complete when the focused control has no text selection API', async () => {
  const input = document.createElement('input')
  input.type = 'number'
  document.body.appendChild(input)
  input.focus()
  const fail = jest.fn()
  const complete = jest.fn()
  const failure = { errMsg: 'getSelectedTextRange:fail no focused input with a text selection' }

  await expect(getSelectedTextRange({ fail, complete })).resolves.toEqual(failure)
  expect(fail.mock.calls).toEqual([[failure]])
  expect(complete.mock.calls).toEqual([[failure]])
})

describe('hideKeyboard', () => {
  const result = { errMsg: 'hideKeyboard:ok' }

  test.each(['input', 'textarea'] as const)('blurs a focused %s', async tag => {
    const input = document.createElement(tag)
    document.body.appendChild(input)
    input.focus()
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    await expect(hideKeyboard({ success, fail, complete })).resolves.toEqual(result)
    expect(document.activeElement).toBe(document.body)
    expect(success.mock.calls).toEqual([[result]])
    expect(complete.mock.calls).toEqual([[result]])
    expect(fail).not.toHaveBeenCalled()
  })

  test('blurs a focused contenteditable element', async () => {
    const editor = document.createElement('div')
    editor.tabIndex = 0
    // jsdom does not implement isContentEditable
    Object.defineProperty(editor, 'isContentEditable', { value: true })
    document.body.appendChild(editor)
    editor.focus()

    await expect(hideKeyboard()).resolves.toEqual(result)
    expect(document.activeElement).toBe(document.body)
  })

  test('blurs an input focused inside a shadow root', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const input = document.createElement('input')
    host.attachShadow({ mode: 'open' }).appendChild(input)
    input.focus()
    expect(host.shadowRoot!.activeElement).toBe(input)

    await expect(hideKeyboard()).resolves.toEqual(result)
    expect(host.shadowRoot!.activeElement).toBeNull()
  })

  test('keeps focus on elements that do not bring up a keyboard', async () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    await expect(hideKeyboard()).resolves.toEqual(result)
    expect(document.activeElement).toBe(button)
  })

  test('succeeds when nothing is focused', async () => {
    const complete = jest.fn()

    await expect(hideKeyboard({ complete })).resolves.toEqual(result)
    expect(complete.mock.calls).toEqual([[result]])
  })
})
