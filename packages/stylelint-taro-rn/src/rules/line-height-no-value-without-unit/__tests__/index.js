import rule, { messages, ruleName } from '..'

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: `
      .foo {
        line-height: 16px;
      }
      `,
      description: 'accepts line-height value with "px" unit'
    }, {
      code: `
      .foo {
        line-height: 16PX;
      }
      `,
      description: 'accepts line-height value with "PX" unit'
    }, {
      code: `
      .foo {
        line-height: 16vh;
      }
      `,
      description: 'accepts line-height value with "vh" unit'
    }, {
      code: `
      .foo {
        line-height: 16rem;
      }
      `,
      description: 'accepts line-height value with "rem" unit'
    }, {
      code: `
      .foo {
        line-height: 16.6px;
      }
      `,
      description: 'accepts line-height value with decimal value'
    }, {
      code: `
      .foo {
        line-height: -16px;
      }
      `,
      description: 'accepts line-height value with negative value'
    }, {
      code: `
      .foo {
        line-height: 1vh;
      }
      `,
      description: 'accepts line-height value with "vh" unit'
    }
  ],

  reject: [
    {
      code: `
      .foo {
        line-height: 1;
      }
      `,
      message: messages.rejected('1'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: -1;
      }
      `,
      message: messages.rejected('-1'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: 100%;
      }
      `,
      message: messages.rejected('100%'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: 100pt;
      }
      `,
      message: messages.rejected('100pt'),
      line: 3,
      column: 22
    }
  ]
})
