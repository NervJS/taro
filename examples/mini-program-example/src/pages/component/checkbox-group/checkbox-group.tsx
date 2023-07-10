import {View, Image, Text, ListView, Label, Checkbox, CheckboxGroup} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './checkbox-group.scss'
import React, {useState} from "react";

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

const furits = [
  {
    key: "apple",
    name: "苹果"
  }, {
    key: "banana",
    name: "香蕉"
  }, {
    key: "peach",
    name: "桃子"
  }
]

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')
  })
  let [multipleSelectedFurits, setMultipleSelectedFurits] = useState([] as string[])

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='Checkbox-Group'></Header>
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <View className='index'>
        <CheckboxGroup name="选择水果" onChange={(event) => {
          setMultipleSelectedFurits(event.detail.value)
        }}>
          <h3>多选：</h3>
          {
            furits.map(item => {
              let checked = multipleSelectedFurits.indexOf(item.name) != -1;
              return <Label key={item.key} className='furit-item'>
                <Checkbox value={item.name} checked={checked} hidden></Checkbox>
                <div className={checked ? 'furit-multiple-selected' : 'furit-multiple-normal'}></div>
                {item.name}
              </Label>
            })
          }
        </CheckboxGroup>
      </View>
    </View>
  )
}
