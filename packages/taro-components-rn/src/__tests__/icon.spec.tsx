import * as React from 'react'
import { Platform } from 'react-native'
import { render } from '@testing-library/react-native'
import Icon from '../components/Icon'

describe('<Icon />', () => {
  describe('ios & android', () => {
    Platform.OS = 'ios'

    const TestedIcon = (<Icon type='success' size={50} />)

    it('simple structure check', () => {
      const { getByTestId } = render(TestedIcon)
      const image = getByTestId('image')
      expect(image).toHaveStyle({
        width: 50,
        height: 50,
      })
    })

    it('specific color', () => {
      const { getByTestId } = render(<Icon type="success" color="red" />)
      const image = getByTestId('image')
      expect(image).toHaveStyle({
        tintColor: 'red'
      })
    })

    it('invalid prop value check', () => {
      // @ts-ignore
      const { getByTestId } = render(<Icon type='miao' />)
      expect(() => getByTestId('image')).toThrow(
        'Unable to find an element with testID: image'
      )
    })
  })
})
