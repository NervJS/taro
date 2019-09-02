/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render, Component } from 'nervjs'
import { MpDocument, createDocument } from '../src/document'

global.window = {}

describe('lifecycle', () => {
  global.window.document = createDocument()
  const doc = window.document
  /**
   * @type {Element} scratch
   */
  let scratch

  beforeEach(() => {
    scratch = doc.createElement('div')
  })

  test('state can destruct from this', () => {
    class A extends Component {
      render () {
        return <div>{this.a} fuck</div>
      }
    }

    render(<A />, scratch)

    console.log(scratch)
    debugger

    expect(false).toBeTruthy()
  })
})
