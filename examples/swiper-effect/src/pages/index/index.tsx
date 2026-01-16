import {
  useState
} from 'react';
import { View ,Swiper, SwiperItem, Image, Button, ScrollView } from '@tarojs/components'
import './index.scss'

export default function Index() {
  const [show, setShow] = useState(true)
  const [circular, setCircular] = useState(true)
  const [displayMultipleItems, setDisplayMultipleItems] = useState(1)
  const [autoplay, setAutoplay] = useState(true)
  const [current, setCurrent] = useState(0)
  const [arr, setArr] = useState([
    {url: 'https://swiperjs.com/demos/images/nature-1.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-2.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-3.jpg'},   
    {url: 'https://swiperjs.com/demos/images/nature-5.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-6.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-7.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-3.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-4.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-5.jpg'},
    {url: 'https://swiperjs.com/demos/images/nature-6.jpg'},
]
  )

  const replace = () => {
    setArr([
      {url: 'https://swiperjs.com/demos/images/nature-1.jpg'},  
      {url: 'https://swiperjs.com/demos/images/nature-3.jpg'},   
      {url: 'https://swiperjs.com/demos/images/nature-5.jpg'},
      {url: 'https://swiperjs.com/demos/images/nature-6.jpg'},
      {url: 'https://swiperjs.com/demos/images/nature-7.jpg'},
      {url: 'https://swiperjs.com/demos/images/nature-8.jpg'},
    ])
  }

  const copyOne = (index) => {
    const copy = arr[index]
    arr.splice(index, 0, copy)
    setArr([...arr ])
  }

  const deleteCurrent = (current) => { 
    arr.splice(current, 1)
    setArr([...arr])
  }

  return (
    <View className='index'>
      <ScrollView scrollY style={{height: 500}}>
        <Swiper
        indicatorDots
        className='swiper-wrap1'
        current={current}
        circular = {circular}
        effectsProps={{nested: true}}
        previousMargin='50px'
        nextMargin='20px'
        autoplay={autoplay}
        onAnimationFinish={(e) => {
          const {current, source } = e.detail
          console.log('animation finish', current, source)

        }}
        onChange={(e) => {
          const {current, source} = e.detail
          console.log('change', current, source)
          setCurrent(current)

        }}

        displayMultipleItems = {displayMultipleItems}
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} className='item' data-source='xxxxxx' itemId={String(index)} >
                <View className='wrap'>
                <Image className='img1' src={item.url}/>
                <Button onClick={()=>deleteCurrent(index)} className='deleteCurrent'>delete</Button>
                <Button onClick={()=>copyOne(index)} className='deleteCurrent'>copy</Button>
                </View>
              </SwiperItem>
            )
              
          })
        }
        </Swiper>
        <Button onClick={()=>{setCircular(!circular)}}>循环  {String(circular)}</Button>
        <Button onClick={()=>{setAutoplay(!autoplay)}}>自动播放：{String(autoplay)} </Button>
        <Button onClick={()=>{replace()}}>replace</Button>
        <Button onClick={()=>{setDisplayMultipleItems(displayMultipleItems+1)}}>displayMultipleItems + 1</Button>
        <Button onClick={()=>{setDisplayMultipleItems(displayMultipleItems-1)}}>displayMultipleItems - 1</Button>
        <Button onClick={()=>{setCurrent(0)}}>回到第一个</Button>
        <Button onClick={()=>{setAutoplay(!autoplay)}}>autoplay {String(autoplay)}</Button>
        <Button onClick={()=>setShow(!show)}>setShow {String(show)}</Button>
      </ScrollView>
    </View>
  )
}
