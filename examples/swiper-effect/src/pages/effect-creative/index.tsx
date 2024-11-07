import {
  useState
} from 'react';
import { View ,Swiper, SwiperItem, Image, Button} from '@tarojs/components'
import './index.scss'


const arr = [
  {url: 'https://swiperjs.com/demos/images/nature-1.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-2.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-3.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-4.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-5.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-6.jpg'},
  {url: 'https://swiperjs.com/demos/images/nature-7.jpg'},

]
export default function Index() {
  const [circular, setCircular] = useState(true)
  const [autoplay, setAutoplay] = useState(false)

  return (
    <View className='index'>
      <View>底下是轮播图</View>
      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: ["-120%", 0, -500],
            },
            next: {
              shadow: true,
              translate: ["120%", 0, -500],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: ["-20%", 0, -1],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: [0, 0, -800],
              rotate: [180, 0, 0],
            },
            next: {
              shadow: true,
              translate: [0, 0, -800],
              rotate: [-180, 0, 0],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: ["-125%", 0, -800],
              rotate: [0, 0, -90],
            },
            next: {
              shadow: true,
              translate: ["125%", 0, -800],
              rotate: [0, 0, 90],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>

      <View className='creative-wrap'>
      <Swiper
        indicatorColor = '#008080'
        indicatorActiveColor= '#fff'
        indicatorDots
        // currentItemId={String(current)}
        className='creative-swiper-wrap'
        circular = {circular}
        autoplay={autoplay}
        effectsProps={{
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              origin: "left center",
              translate: ["-5%", 0, -200],
              rotate: [0, 100, 0],
            },
            next: {
              origin: "right center",
              translate: ["5%", 0, -200],
              rotate: [0, -100, 0],
            },
          },
        }
        }
        interval={500}
      >
        {
          arr.map((item, index) => {
            return (
              <SwiperItem key={index} itemId={String(index)} className='creative-item'>
                <Image className='creative-img' src={item.url}/>
              </SwiperItem>
            )
              
          })
        }
      </Swiper>
      </View>
        <Button onClick={()=>{setCircular(!circular)}}>循环{String(circular)}</Button>
        <Button onClick={()=>{setAutoplay(!autoplay)}}>autoplay {String(autoplay)}</Button>
    </View>
  )
}
