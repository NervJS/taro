import { messages, ruleName } from '../index.ts'

// @ts-ignore
testRule({
  ruleName,
  config: true,
  // 可通过用例
  accept: [
    { code: '.app {}' }
  ],
  // 不可通过用例
  reject: [
    {
      code: '.a .b {}',
      message: messages.rejected('.a .b', 'harmony, rn'),
      line: 1,
      column: 1,
    },
    {
      code: '#a .b {}',
      message: messages.rejected('#a .b', 'harmony, rn'),
      line: 1,
      column: 1,
    },
    {
      code: '.a>.b {}',
      message: messages.rejected('.a>.b', 'harmony, rn'),
      line: 1,
      column: 1,
    },
    {
      code: '.a+.b {}',
      message: messages.rejected('.a+.b', 'harmony, rn'),
      line: 1,
      column: 1,
    },
    {
      code: '.a~.b {}',
      message: messages.rejected('.a~.b', 'harmony, rn'),
      line: 1,
      column: 1,
    }
  ]
})
