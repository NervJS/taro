import { View, Text, Image, GridView, ListView, RootPortal, StickyHeader, StickySection, CheckboxGroup, Checkbox, Label, RadioGroup, Radio } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useState } from 'react'

const grid_data = [
  {
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
    value: '领取中心'
  },
  {
    image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
    value: '找折扣'
  },
  {
    image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    value: '领会员'
  },
  {
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
    value: '新品首发'
  },
  {
    image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
    value: '领京豆'
  },
  {
    image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
    value: '手机馆'
  }
]

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

      <GridView columnNum={3} data={grid_data} columnItem={(childItem, i, index) => (

        <View key={`grid-group-item-${index}`}
              onClick={() => (console.log('childItem ' + childItem.value + ' i ' + i + ' index ' + index))}>
          {childItem.image && (
            <Image
              src={childItem.image}
              mode='scaleToFill'
            />
          )}
          <Text>
            {childItem.value}
          </Text>
        </View>

      )} />

      <ListView orientation={'vertical'} data={grid_data} columnItem={(childItem, i) => (

        <View key={`list-group-item-${i}`} onClick={() => (console.log('childItem ' + childItem.value + ' i ' + i))}>
          {childItem.image && (
            <Image
              src={childItem.image}
              mode='scaleToFill'
            />
          )}
          <Text>
            {childItem.value}
          </Text>
        </View>

      )} />

    </View>
  )
}
