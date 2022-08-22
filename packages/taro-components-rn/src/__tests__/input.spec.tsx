import * as React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import Input from '../components/Input'

describe('<Input /> & <Textarea>', () => {
  describe('events', () => {
    it('onKeyDown', () => {
      const onKeyDown = jest.fn()
      const { getByPlaceholderText } = render(<Input onKeyDown={onKeyDown} placeholder="placeholder" />)
      fireEvent(getByPlaceholderText('placeholder'), 'KeyPress', { nativeEvent: { key: 'Enter' } })
      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({
        which: 13,
        target: expect.objectContaining({
          value: expect.any(String)
        })
      }))
    })
  })

  describe('prop value changed', () => {
    it('should be new value', async () => {
      const onChange = jest.fn().mockImplementation(res => {
        expect(res).toMatchObject({
          target: expect.objectContaining({
            value: expect.any(String)
          }),
          detail: expect.objectContaining({
            value: expect.any(String)
          })
        })
        return res.detail.value
      })
      const { getByPlaceholderText } = render(<Input onChange={onChange} value={'default text'} placeholder="placeholder" />)
      const input = getByPlaceholderText('placeholder')
      expect(input).toHaveProp('value', 'default text')
      fireEvent.changeText(input, 'new text')
      // expect(input).toHaveProp('value', 'new text')
    })
  })
})
