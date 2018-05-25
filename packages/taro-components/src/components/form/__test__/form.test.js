import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Form from '../index'

describe('Form', () => {
  it('render Form', () => {
    const handleSubmit = jest.fn()
    const handleReset = jest.fn()

    let component = renderIntoDocument(
      <Form onSubmit={handleSubmit} onReset={handleReset} >
        this is form
      </Form>
    )
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('this is form')
  })
})
