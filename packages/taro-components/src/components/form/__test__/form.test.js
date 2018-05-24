import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Form from '../index'

describe('Form', () => {
  it('render Form', () => {
    const handleSubmit = jest.fn()
    const handleReset = jest.fn()
    const state = {
      checkboxItem: [],
      radioItem: []
    }

    let component = renderIntoDocument(
      <Form onSubmit={handleSubmit} onReset={handleReset} state={state}>
        this is form
      </Form>
    )
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('this is form')
  })
})
