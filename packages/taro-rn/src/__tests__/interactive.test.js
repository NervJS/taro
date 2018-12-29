import React from 'react'
import { TouchableHighlight, Text } from 'react-native'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import ActionSheet from '../api/ActionSheet'
import Dialog from '../api/Dialog'
import LoadingView from '../api/WxToast/LoadingView'

describe('interactive', function () {
  describe('showActionSheet', function () {
    it('should render ActionSheet success', function () {
      const wrapper = mount(<ActionSheet
        autoDectect
        type={'ios'}
        visible={false}
        onClose={() => {}}
        menus={['选项一', '选项二'].map((item, index) => {
          return {
            type: 'default',
            label: item,
            textStyle: {color: '#000000'},
            onPress: () => {}
          }
        })}
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: {color: '#000000'},
            onPress: () => {}
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
        onClose={() => {}}
        menus={['选项一', '选项二'].map((item, index) => {
          return {
            type: 'default',
            label: item,
            textStyle: {color: '#000000'},
            onPress: success
          }
        })}
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: {color: '#000000'},
            onPress: () => {}
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
        onClose={() => {}}
        buttons={[
          {
            type: '#000000',
            label: '取消',
            onPress: () => {}
          },
          {
            type: '#3CC51F',
            label: '确定',
            onPress: () => {}
          }
        ].filter(Boolean)}
      ><Text>Test</Text></Dialog>)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
  describe('Toast', function () {
    it('should render LoadingView success', function () {
      const wrapper = mount(<LoadingView />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
})
