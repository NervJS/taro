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
                func: (formData) => {
                    Taro.addPhoneContact({
                        ...formData,
                        success() {
                          Taro.showToast({
                            title: '联系人创建成功'
                          })
                          console.log('success-----');
                        },
                        fail() {
                          Taro.showToast({
                            title: '联系人创建失败'
                          })
                          console.log('fail-----');
                        }
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
        const formData = e.detail.value;
        const submitFunc = this.state.list[0].func;
        submitFunc != null && submitFunc(formData);
    }
    render () {
        return (
            <View className='api-page'>
                <Form onSubmit={this.submit}>
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
                </Form>
            </View>
        )
    }
}
