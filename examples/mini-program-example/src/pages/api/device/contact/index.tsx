import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import { TestConsole } from '@/util/util'
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
          TestConsole.consoleTest('addPhoneContact')
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
            success: (res) => {
              TestConsole.consoleSuccess(res)
              Taro.showToast({
                title: `联系人创建成功:${res.errMsg}`
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showToast({
                title: `联系人创建失败:${res.errMsg}`
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'chooseContact',
        func: null,
      },
    ],
  }

  render() {
    return (
      <View className='api-page'>
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
