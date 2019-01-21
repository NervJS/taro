const rule = require('../rules/duplicate-name-of-state-and-props')
const { RuleTester } = require('eslint')
const { parserOptions } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

function testConstructor (code) {
  return `class A extends Component {
    constructor () {
      this.state = {
        a: '',
        b: '',
        c: ''
      }
    }

    render () {
      ${code}
    }
  }`
}

ruleTester.run('duplicate-name-of-state-and-props', rule, {
  valid: [
    {
      code: testConstructor(`this.props.e`)
    },
    {
      code: testConstructor(`this.props.f`)
    },
    {
      code: testConstructor(`this.props.aa`)
    },
    {
      code: testConstructor(`this.props.bb`)
    },
    {
      code: testConstructor(`this.a`)
    }
  ],
  invalid: [
    {
      code: testConstructor(`this.props.a`),
      errors: []
    },
    {
      code: testConstructor(`this.props.b`),
      errors: []
    },
    {
      code: testConstructor(`this.props.c`),
      errors: []
    },
    {
      code: testConstructor(`this.props.d`),
      errors: []
    }
  ]
})
