import { getSelectedTextRange } from '../../src/api/device/keyboard'

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
