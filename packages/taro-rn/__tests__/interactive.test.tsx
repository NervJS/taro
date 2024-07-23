import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { Mask } from '../src/lib/Mask'
import { Popup } from '../src/lib/Popup'
import ActionSheet from '../src/lib/showActionSheet/ActionSheet'
import Dialog from '../src/lib/showModal/Dialog'

describe('interactive', function () {
  describe('showActionSheet', function () {
    it('should call success callback', function () {
      const onPress = jest.fn()
      const { getByText, getAllByText } = render(<ActionSheet
        autoDectect
        type={'ios'}
        visible
        onClose={jest.fn()}
        menus={['Option One', 'Option Two'].map((item) => {
          return {
            type: 'default',
            label: item,
            textStyle: { color: '#000000' },
            onPress,
          }
        })}
        actions={[
          {
            type: 'default',
            label: 'cancel',
            textStyle: { color: '#000000' },
            onPress: jest.fn()
          }
        ]}
      />)
      expect(getAllByText('Option One')).toHaveLength(1)
      expect(getAllByText('Option Two')).toHaveLength(1)
      expect(getAllByText('cancel')).toHaveLength(1)
      fireEvent.press(getByText('Option One'))
      expect(onPress).toHaveBeenCalled()
    })
  })
  describe('showModal', function () {
    it('should render Dialog success', function () {
      const { getByText } = render(<Dialog
        visible
        autoDectect
        title='TITLE'
        onClose={jest.fn()}
        buttons={[
          {
            type: '#000000',
            label: 'cancel',
            onPress: jest.fn()
          },
          {
            type: '#3CC51F',
            label: 'confirm',
            onPress: jest.fn()
          }
        ].filter(Boolean)}
      ><Text>Test</Text></Dialog>)
      expect(getByText('TITLE')).toHaveStyle({
        fontSize: 17
      })
      expect(getByText('Test')).toHaveStyle({
        fontSize: 17
      })
      expect(getByText('confirm')).toHaveStyle({
        color: '#3CC51F'
      })
      expect(getByText('cancel')).toHaveStyle({
        color: '#000000'
      })
    })
  })
  describe('Mask', () => {
    it('should emit Mask event success', () => {
      const onPress = jest.fn()
      const { getByText, getByLabelText } = render(<Mask style={{ backgroundColor: 'red' }} onPress={onPress}><Text>Press me</Text></Mask>)
      expect(getByLabelText('mask')).toHaveStyle({
        backgroundColor: 'red'
      })
      fireEvent.press(getByText('Press me'))
      expect(onPress).toHaveBeenCalled()
    })
  })
  describe('Popup', () => {
    it('should emit Popup event success', async () => {
      const onShow = jest.fn()
      const onClose = jest.fn()
      const { getByText } = render(<Popup
        visible
        style={{ backgroundColor: 'red' }}
        onShow={onShow}
        onClose={onClose}
      ><Text>Press me</Text></Popup>)
      fireEvent.press(getByText('Press me'))
      expect(onClose).toHaveBeenCalled()
    })
  })
})
