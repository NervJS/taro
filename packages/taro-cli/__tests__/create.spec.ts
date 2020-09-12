import scanPageName from '../src/create/scanPageName'

describe('create', () => {
  it('page name expect invalid javascript identifier name', () => {
    expect(scanPageName('hello')).toEqual('hello')
    expect(scanPageName('hello6')).toEqual('hello6')
    expect(scanPageName('_hello')).toEqual('_hello')
    expect(scanPageName('\\u0068ello')).toEqual('hello')
    expect(scanPageName('_\\u0068ello')).toEqual('_hello')
    expect(scanPageName('\\u{0068}ello')).toEqual('hello')
    expect(scanPageName('_\\u{0068}ello')).toEqual('_hello')
    expect(() => scanPageName('_\\u008ello')).toThrowError(
      'Invalid Unicode escape\n' +
      '_\\u008ello\n' +
      ' ^^^^^^'
    )
    expect(() => scanPageName('*hello')).toThrowError(
      'Unexpected start of text\n' +
      '*hello\n' +
      '^'
    )
    expect(() => scanPageName('he?llo')).toThrowError(
      'Unexpected token \'?\'\n' +
      'he?llo\n' +
      '  ^'
    )
  })
})
