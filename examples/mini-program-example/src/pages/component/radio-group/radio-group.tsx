import {View, Image,  Text, RadioGroup, Radio,Label} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './radio-group.scss'
import React, {useState} from "react";
import Header from "../../../components/head/head";
import ComponentState from "../../../components/component_state/component_state";

const furits = [
  {
    key: "apple",
    name: "苹果"
  },{
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

  let [singleSelectedFurits, setSingleSelectedFurits] = useState(null)

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='RadioGroup'></Header>
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <View className='index'>
        <RadioGroup name="选择水果" onChange={(event) => {
          setSingleSelectedFurits(event.detail.value)
        }}>
          <h3>单选：</h3>
          {
            furits.map(item => {
              let checked = (singleSelectedFurits == item.key);
              return <div key={item.key} className='furit-item'>
                <Radio id={item.key} value={item.key} checked={checked} hidden></Radio>
                <div className={checked ? 'furit-selected' : 'furit-normal'}></div>
                <Label for={item.key}>{item.name}</Label>
              </div>
            })
          }
        </RadioGroup>
      </View>
    </View>
  )
}
