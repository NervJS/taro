import {View, Text,Image,GridView,ListView, Button, PageContainer,MatchMedia,RootPortal, StickyHeader, StickySection, CheckboxGroup, Checkbox, Label, RadioGroup, Radio } from '@tarojs/components'
import Taro, {useLoad} from '@tarojs/taro'
import './index.scss'
import React, {useState} from "react";

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

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  let [multipleSelectedFurits, setMultipleSelectedFurits] = useState([] as string[])

  let [singleSelectedFurits, setSingleSelectedFurits] = useState(null)

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/grid-view/index'
        })
      }}>GridView</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/list-view/index'
        })
      }}>ListView</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/page-container/index'
        })
      }}>PageContainer</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/match-media/index'
        })
      }}>MatchMedia</Button>


      <div>
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
      </div>

      <div>
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
      </div>

      <RootPortal enable={false} style={{
        position: 'absolute',
        background: '#212121',
        width: '80%',
        left: '10%',
        top: '50%',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Text>Hello RootPortal!</Text>
        <Text>Hello RootPortal!</Text>
      </RootPortal>
      <StickyHeader>
        <StickySection style={{background: '#aaaaaa'}}>
          吸顶布局容器测试
        </StickySection>
      </StickyHeader>

    </View>
  )
}
