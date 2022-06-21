import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import iconBack from './icon_back.webp'
import './index.scss'
import 'src/components/navbar/resolver'

console.log('isRn', process.env.TARO_ENV === 'rn')
export default function Navbar (props: Props) {
  const { title, rightElement } = props
  const back = () => Taro.navigateBack()

  return (
    <View className='navbar'>
      <View className='navbar-leftElement'>
        <Image className='icon-back' src={iconBack} onClick={back}></Image>
      </View>
      <View className='navbar-title'>
        {
          typeof (title) === 'string'
            ? <Text className='navbar-title-text'>{title}</Text>
            : title
        }
      </View>
      <View className='navbar-rightElement'>
        {rightElement}
      </View>
    </View>
  )
}

type Props = {
  title: string | any,
  rightElement?: any,
  back?: () => void,
};
