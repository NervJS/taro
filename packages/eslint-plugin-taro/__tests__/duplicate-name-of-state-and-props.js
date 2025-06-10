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

function testClassProperty (code) {
  return `class A extends Component {
    state = {
      a: '',
      b: '',
      c: ''
    }

    render () {
      ${code}
    }
  }`
}

function buildErrMsg (name) {
  return `this.state.${name} 与 this.props.${name} 重复可能会导致渲染结不如意料之中的结果。`
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
    },
    {
      code: testClassProperty(`this.a`)
    },
    {
      code: testClassProperty(`this.props.e`)
    },
    {
      code: testClassProperty(`this.props.f`)
    },
    {
      code: testClassProperty(`this.props.aa`)
    },
    {
      code: testClassProperty(`this.props.bb`)
    }
  ],
  invalid: [
    {
      code: testConstructor(`this.props.a`),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testConstructor(`this.props.b`),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testConstructor(`this.props.c`),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testConstructor(`const { c } = this.props`),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testConstructor(`const { b } = this.props`),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testConstructor(`const { a } = this.props`),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testClassProperty(`this.props.a`),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testClassProperty(`this.props.b`),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testClassProperty(`this.props.c`),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testClassProperty(`const { c } = this.props`),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testClassProperty(`const { b } = this.props`),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testClassProperty(`const { a } = this.props`),
      errors: [{ message: buildErrMsg('a') }]
    }
  ]
})
