import Nerv from 'nervjs'
import { renderIntoDocument, Simulate } from 'nerv-test-utils'
import Form from '../index'
import Switch from '../../switch/index'
import Radio from '../../radio/index'
import Textarea from '../../textarea/index'
import Checkbox from '../../checkbox/index'

describe('Form', () => {
  it('render Form', () => {
    const handleSubmit = jest.fn()
    const handleReset = jest.fn()

    let component = renderIntoDocument(
      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <input type='text' name='input' class='taro-checkbox_checked' />
        <button class='submit' formType='submit' type='submit' />
        <button class='reset' formType='reset' type='reset' />
        <Switch checked />
        <Radio color='#09bb07' value='test' name='test' checked />
        <Checkbox
          color='#09bb07'
          value='checkboxtest'
          name='checkboxtest'
          checked
        />
        <Checkbox
          color='#09bb07'
          value='checkboxtest2'
          name='checkboxtest'
          checked
        />
        <Textarea placeholder='请输入文本' rows='4' />
      </Form>
    )
    const dom = Nerv.findDOMNode(component)
    const submitBtn = dom.querySelector('.submit')

    Simulate.click(submitBtn)
    expect(handleSubmit).toHaveBeenCalled()

    // const resetBtn = dom.querySelector('.reset')
    // Simulate.click(resetBtn)
    // expect(handleReset).toHaveBeenCalled()

    // const switch = dom.querySelector('.submit')
    // const scryResults = scryRenderedDOMComponentsWithClass(component, 'taro-checkbox_checked')
    // expect(scryResults.length).toBe(1)
  })
})
