import {View, Image, Text, ListView, Label, Checkbox, CheckboxGroup} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './index.scss'
import React, {useState} from "react";

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

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })
  let [multipleSelectedFurits, setMultipleSelectedFurits] = useState([] as string[])

  return (
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
  )
}
