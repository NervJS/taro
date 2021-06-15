// eslint-disable-next-line
import React from 'react'
import { TouchableHighlight, Text } from 'react-native'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import ActionSheet from '../lib/showActionSheet/ActionSheet'
import Dialog from '../lib/showModal/Dialog'
import { Mask } from '../lib/Mask'
import { Popup } from '../lib/Popup'

describe('interactive', function () {
  describe('showActionSheet', function () {
    it('should render ActionSheet success', function () {
      const wrapper = mount(<ActionSheet
        autoDectect
        type={'ios'}
        visible={false}
        onClose={jest.fn()}
        menus={['选项一', '选项二'].map((item) => {
          return {
            type: 'default',
            label: item,
            textStyle: { color: '#000000' },
            onPress: jest.fn()
          }
        })}
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: { color: '#000000' },
            onPress: jest.fn()
          }
        ]}
      />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('should call success callback', function () {
      const success = jest.fn()
      const wrapper = mount(<ActionSheet
        autoDectect
        type={'ios'}
        visible
        onClose={jest.fn()}
        menus={['选项一', '选项二'].map((item) => {
          return {
            type: 'default',
            label: item,
            textStyle: { color: '#000000' },
            onPress: success
          }
        })}
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: { color: '#000000' },
            onPress: jest.fn()
          }
        ]}
      />)
      // expect(wrapper.find(TouchableHighlight).at(0)).toBe(1)
      wrapper.find(TouchableHighlight).first().props().onPress()
      expect(success.mock.calls.length).toBe(1)
    })
  })
  describe('showModal', function () {
    it('should render Dialog success', function () {
      const wrapper = mount(<Dialog
        visible
        autoDectect
        title='title'
        onClose={jest.fn()}
        buttons={[
          {
            type: '#000000',
            label: '取消',
            onPress: jest.fn()
          },
          {
            type: '#3CC51F',
            label: '确定',
            onPress: jest.fn()
          }
        ].filter(Boolean)}
      ><Text>Test</Text></Dialog>)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
  describe('Mask', () => {
    it('should render Mask success', () => {
      const wrapper = mount(<Mask style={{ color: 'red' }} onPress={jest.fn()}><Text>Test</Text></Mask>)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('should emit Mask event success', () => {
      const onPress = jest.fn()
      const wrapper = mount(<Mask style={{ color: 'red' }} onPress={onPress}><Text>Test</Text></Mask>)
      wrapper.find(Mask).first().props().onPress()
      expect(onPress.call.length).toBe(1)
    })
  })
  describe('Popup', () => {
    it('should render Popup success', () => {
      const onShow = jest.fn()
      const onClose = jest.fn()
      const wrapper = mount(<Popup
        style={{ color: 'red' }}
        onShow={onShow}
        onClose={onClose}
      ><Text>Test</Text></Popup>)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('should emit Popup event success', () => {
      const onShow = jest.fn()
      const onClose = jest.fn()
      const wrapper = mount(<Popup
        visible
        style={{ color: 'red' }}
        onShow={onShow}
        onClose={onClose}
      ><Text>Test</Text></Popup>)
      expect(onShow.call.length).toBe(1)
      wrapper.find(Mask).at(0).props().onPress()
      expect(onClose.call.length).toBe(1)
    })
  })
})
