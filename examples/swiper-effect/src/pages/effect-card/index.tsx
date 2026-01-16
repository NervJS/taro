import {
  useState
} from 'react';
import { View ,Swiper, SwiperItem, Image, Button} from '@tarojs/components'
import './index.scss'

export default function Index() {
  const [circular, setCircular] = useState(true)
  const [displayMultipleItems, setDisplayMultipleItems] = useState(1)
  const [autoplay, setAutoplay] = useState(false)
  const [current, setCurrent] = useState(0)
  const [arr, setArr] = useState([
    {url: 'https://swiperjs.com/demos/images/nature-1.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-2.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-3.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-4.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-5.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-6.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-7.jpg'},
  ])


  return (
    <View className='index'>
      <View>底下是轮播图</View>
      <View className='card-wrap'>
      <Swiper
        indicatorColor = '#000'
        indicatorActiveColor= '#fff'
        indicatorDots
        className='card-swiper-wrap'
        current={current}
        circular = {circular}
        autoplay={autoplay}
        onChange={(e) => {
          const {current} = e.detail
          setCurrent(current)
        }}
        effectsProps={{
          effect: 'cards',
        }
        }
        displayMultipleItems = {displayMultipleItems}
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='card-item'>
                <Image className='card-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

        <Button onClick={()=>{setCircular(!circular)}}>循环{String(circular)}</Button>
        <Button onClick={()=>{setCurrent(0)}}>回到第一个</Button>
        <Button onClick={()=>{setAutoplay(!autoplay)}}>autoplay {String(autoplay)}</Button>
    </View>
  )
}
