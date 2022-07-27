import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import {
  Checkbox,
  CheckboxGroup,
  Label,
  Radio,
  RadioGroup
} from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Label', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('label contain subject', async () => {
    const ref = React.createRef()
    const onChange = sinon.spy()
    const app = (
      <CheckboxGroup onChange={onChange}>
        <Label>
          <Checkbox value='dog' ref={ref} />
          <div id='dog'>dog</div>
        </Label>
        <Label>
          <Checkbox value='cat' checked />
          <div id='cat'>cat</div>
        </Label>
      </CheckboxGroup>
    )
    const { node, find } = await mount(app, scratch)
    const target = find('#dog')
    const input = ref.current.querySelector('input')

    assert(node.value.length === 1)
    assert(node.value.includes('cat'))

    simulant.fire(target, 'click')
    await waitForChange(input)

    assert(node.value.length === 2)
    assert(node.value.includes('cat'))
    assert(node.value.includes('dog'))
    assert(onChange.callCount === 1)
  })

  it('label for', async () => {
    const radioGroup = React.createRef()
    const labelRef = React.createRef()
    const onChange = sinon.spy()
    const app = (
      <div>
        <RadioGroup ref={radioGroup} onChange={onChange}>
          <Radio id='gz' value='GuangZhou'>GuangZhou</Radio>
          <Radio id='sz' value='ShenZhen' checked={true}>ShenZhen</Radio>
        </RadioGroup>

        <Label for='gz' ref={labelRef}>广州</Label>
        <Label for='sz'>深圳</Label>
      </div>
    )
    await mount(app, scratch)
    const gz = labelRef.current.querySelector('label')

    assert(radioGroup.current.value === 'ShenZhen')

    simulant.fire(gz, 'click')

    assert(radioGroup.current.value === 'GuangZhou')
    assert(onChange.callCount === 1)
  })
})
