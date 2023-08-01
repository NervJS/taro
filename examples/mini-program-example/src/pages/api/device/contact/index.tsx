import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Form, Input } from '@tarojs/components'
import './index.scss'

/**
 * 设备-联系人
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'addPhoneContact',
        func: () => {
          let formData = {
            firstName: 'Li',
            photoFilePath: '',
            nickName: '花',
            middleName: 'luo',
            lastName: 'xiaohua',
            remark: 'test remark',
            mobilePhoneNumber: '454545321',
            weChatNumber: 'test wechat num',
            addressCountry: 'China',
            addressState: 'Hubei',
            addressCity: 'Wuhan',
            addressStreet: 'shendunyilu',
            addressPostalCode: '4500321',
            organization: 'huawei',
            title: 'worker',
            workFaxNumber: '1234487',
            workPhoneNumber: '123-123',
            hostNumber: '8671-123123',
            email: 'asdjjb@wds.com',
            url: 'www.baidu.com',
            workAddressCountry: 'China',
            workAddressState: 'Guangdong',
            workAddressCity: 'Dongguan',
            workAddressStreet: 'songshanhu',
            workAddressPostalCode: '123874',
            homeFaxNumber: '026105',
            homePhoneNumber: '12340-12843',
            homeAddressCountry: 'China',
            homeAddressState: 'Fujian',
            homeAddressCity: 'Quanzhou',
            homeAddressStreet: '123street',
            homeAddressPostalCode: '0001237',
          }
          Taro.addPhoneContact({
            ...formData,
            success() {
              Taro.showToast({
                title: '联系人创建成功',
              })
              console.log('success-----')
            },
            fail() {
              Taro.showToast({
                title: '联系人创建失败',
              })
              console.log('fail-----')
            },
            complete: (res) => {
              Taro.showToast({
                title: '联系人创建完成',
              })
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'chooseContact',
        func: null,
      },
    ],
  }
  submit = (e) => {
    const formData = e.detail.value
    const submitFunc = this.state.list[0].func
    submitFunc != null && submitFunc(formData)
  }
  render() {
    return (
      <View className='api-page'>
        {/* <Form onSubmit={this.submit}>
                    <View className="page-section">
                        <View className="weui-cells__title">姓氏</View>
                        <View className="weui-cells weui-cells_after-title">
                            <View className="weui-cell weui-cell_Input">
                                <Input className="weui-Input" name="lastName" />
                            </View>
                        </View>
                    </View>
                    <View className="page-section">
                        <View className="weui-cells__title">名字</View>
                        <View className="weui-cells weui-cells_after-title">
                            <View className="weui-cell weui-cell_Input">
                                <Input className="weui-Input" name="firstName" />
                            </View>
                        </View>
                    </View>
                    <View className="page-section">
                        <View className="weui-cells__title">手机号</View>
                        <View className="weui-cells weui-cells_after-title">
                            <View className="weui-cell weui-cell_Input">
                                <Input className="weui-Input" name="mobilePhoneNumber" />
                            </View>
                        </View>
                    </View>
                    <View className="btn-area">
                        <Button className='api-page-btn' type="primary" formType="submit">addPhoneContact</Button>
                        <Button className='api-page-btn' type="primary" onClick={this.state.list[1].func == null ? () => {} : this.state.list[1].func}>
                            chooseContact
                            {this.state.list[1].func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)}
                        </Button>
                    </View>
                </Form> */}
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
