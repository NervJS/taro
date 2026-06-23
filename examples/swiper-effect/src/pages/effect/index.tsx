import {
  useEffect,
  useState
} from 'react';
import { View ,Swiper, SwiperItem, Image, Button} from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const effectList = [
    {name:'cube', path: '/pages/effect-cube/index'},
    {name:'flip', path: '/pages/effect-flip/index'},
    {name:'cards', path: '/pages/effect-card/index'},
    {name:'coverflow', path: '/pages/effect-coverflow/index'},
    {name:'fade', path: '/pages/effect-fade/index'},
    {name:'creative', path: '/pages/effect-creative/index'},
  ]
 
  return (
    <View className='index'>
      {
        effectList.map(({name, path})=>{
          return (
            <Button key={name}  onClick={()=>{
              navigateTo({
                url: path
              })
            }}>
              {name}
            </Button>
          )
        })
      }
    </View>
  )
}
