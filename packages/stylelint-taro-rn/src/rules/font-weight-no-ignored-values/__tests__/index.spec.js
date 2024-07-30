import { messages, ruleName } from '../index.js'

const acceptedWeights = ['400', '700', 'normal', 'bold']
const rejectedWeights = ['100', '200', '300', '500', '600', '800', '900']

testRule({
  ruleName,
  config: [true],

  accept: acceptedWeights.map(w => {
    return {
      code: `
      .foo {
        font-weight: ${w};
      }
      `,
      description: `font-weight: ${w}`
    }
  }),

  reject: rejectedWeights.map(w => {
    return {
      code: `
      .foo {
        font-weight: ${w};
      }
      `,
      description: `font-weight: ${w}`,
      message: messages.rejected(w),
      line: 3,
      column: 22
    }
  })
})
