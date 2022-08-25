import * as React from 'react'
import { View } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'
import Label from '../components/Label'
import Checkbox from '../components/Checkbox'
import CheckboxGroup from '../components/CheckboxGroup'

describe('<Checkbox />', () => {
  describe('<Checkbox />', () => {
    it('default', () => {
      const { getByTestId } = render(<Checkbox value="Tom" color="red" />)
      expect(getByTestId('image')).toHaveStyle({
        tintColor: 'red'
      })
    })

    it('should be checked', () => {
      const { getByTestId, update } = render(<Checkbox checked={false} />)
      expect(getByTestId('icon')).toHaveStyle({
        opacity: 0
      })
      update(<Checkbox checked={true} />)
      expect(getByTestId('icon')).toHaveStyle({
        opacity: 1
      })
    })

    describe('onPress', () => {
      it('normal', () => {
        const onChange = jest.fn().mockImplementation(({ value, checked }) => {
          expect(checked).toBe(true)
          expect(value).toBe('apple')
        })
        const { getByText } = render(<Checkbox onChange={onChange} value="apple">Check</Checkbox>)
        fireEvent.press(getByText('Check'))
        expect(onChange.call.length).toBe(1)
      })

      it('disabled', () => {
        const onChange = jest.fn()
        const { getByText, getByTestId } = render(<Checkbox onChange={onChange} disabled={true}>Check</Checkbox>)
        fireEvent.press(getByText('Check'))
        expect(onChange).not.toHaveBeenCalled()
        expect(getByTestId('icon')).toHaveStyle({
          opacity: 0
        })
      })
    })
  })

  describe('<CheckboxGroup />', () => {
    it('should render well', () => {
      const onChange = jest.fn()
      const { getByText } = render(
        <CheckboxGroup onChange={onChange} style={{ flexDirection: 'row' }}>
          <View><View /></View>
          <Label><Checkbox value={0} >Check0</Checkbox></Label>
          <Label><Checkbox value={1} >Check1</Checkbox></Label>
          <Label><Checkbox value={2} >Check2</Checkbox></Label>
        </CheckboxGroup>
      )
      fireEvent.press(getByText('Check0'))
      expect(onChange).toHaveBeenLastCalledWith({
        detail: {
          value: [0]
        }
      })
      fireEvent.press(getByText('Check1'))
      expect(onChange).toHaveBeenLastCalledWith({
        detail: {
          value: [0, 1]
        }
      })
      fireEvent.press(getByText('Check2'))
      fireEvent.press(getByText('Check1'))
      expect(onChange).toHaveBeenCalledTimes(4)
    })
  })
})
