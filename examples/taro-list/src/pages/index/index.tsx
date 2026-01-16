import { View, Image, ScrollView, Text, Script } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { fetchProductsData } from '../../utils'
import './index.scss'
import { useState } from 'react'

function useCanPan (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [canPan, setCanPan] = useState(false)
  Taro.useReady(() => {
    const page = Taro.getCurrentInstance().page!
    Taro.createIntersectionObserver(page)
      .relativeTo('.page', { top: 10 })
      .observe('.main__banner', res => {
        const { boundingClientRect, relativeRect } = res
        if (
          res.intersectionRatio <= 0 &&
          Math.abs(boundingClientRect.bottom - relativeRect.top) < Math.abs(boundingClientRect.top - relativeRect.bottom)
        ) {
          setCanPan(true)
        }
      })
  })
  return [canPan, setCanPan]
}

function useCurrentCategory () {
  const [current, setCurrent] = useState(0)
  Taro.useReady(() => {
    const page = Taro.getCurrentInstance().page!
    Taro.createIntersectionObserver(page, {
      observeAll: true,
    })
      .relativeTo('.product__list')
      .observe('.product__list-section--title', res => {
        const { boundingClientRect, relativeRect } = res
        if (Math.abs(boundingClientRect.bottom - relativeRect.top) < Math.abs(boundingClientRect.top - relativeRect.bottom)) {
          const id = Number(res['dataset'].id)
          const index = res.intersectionRatio <= 0 ? id + 1 : id
          setCurrent(Math.max(index, 0))
        }
      })
  })
  return [current]
}

function Content () {
  const [canPan, setCanPan] = useCanPan()
  return (
    <View className='content' compileMode>
      <Script src='./animation.wxs' module='ani'></Script>
      <View className='content__wrapper'></View>
      <View className='content__body'>
        <View className='content__card'>
          <View className='content__title'>微信学堂</View>
          <View className='content__simple'>
            <View className='content__info'>
              <Text className='content__info-rate'>⭐️ 5.0</Text>
              <Text>66万人学过</Text>
              <Text>好评度100%</Text>
            </View>
            <View className='content__tags'>
              <Text className='content__tag'>开发</Text>
              <Text className='content__tag'>行业</Text>
              <Text className='content__tag'>服务商</Text>
            </View>
          </View>
          <View className='content__detail'>
            <View className='content__info'>
              <Text className='content__info-rate'>⭐️ 5.0</Text>
              <Text>66万人学过</Text>
              <Text>好评度100%</Text>
            </View>
            <View><Text className='content__tips'>视频讲解、代码演示、文档一应俱全</Text></View>
            <View className='section'>
              <View className='section__title'>热门活动</View>
              <View className='section__content'><View className='section__tag'>开发</View>小程序开发从入门到进阶</View>
              <View className='section__content'><View className='section__tag'>行业</View>线上运营方法论</View>
              <View className='section__content'><View className='section__tag'>服务商</View>如何成为微信服务商</View>
            </View>
            <View className='section'>
              <View className='section__title'>公告</View>
              <View className='section__content'>「微信学堂」已经上线了 70+ 门专题课程，支持小程序、公众号、企业微信、视频号等产品能力，帮助广大开发者和商家共同成长。</View>
              <View className='section__content'>商超零售、房地产、餐饮、酒旅、医疗... 「微信学堂」提供超过10个行业的经营教程。报名成为“微信小程序行业伙伴”，还有机会参加每月的闭门交流会，获取官方一手信息。</View>
            </View>
          </View>
        </View>
        <View className='main' onTransitionEnd={ani.mianTransitionEnd}>
          <View className='main__banner-wrapper'>
            <Image className='main__banner' mode="widthFix" src="https://res.wx.qq.com/op_res/Gnr7xWUyNQyvf47WmPbKKCtaVNNyqiH61l5dcIBQUKifZeRA-fcA13QZ0IjqUZf7nUnj5ObWm7PusO8OIwyOug" />
          </View>
          <View className='main__container-wrapper'>
            <View className='main__container' style={canPan ? 'position: fixed;top: 0' : ''}>
              <View className='main__tabs'>
                <View className='main__tab main__tab--active'>课程</View>
                <View className='main__tab'>评价</View>
              </View>
              <ProductList canPan={canPan} setCanPan={setCanPan}></ProductList>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

function ProductList ({ canPan, setCanPan }) {
  const data = fetchProductsData()
  const [current] = useCurrentCategory()

  return (
    <View className='product'>
      <View className='product__category'>
        {
          data.map((item, index) => (
            <View className={'product__category-item' + (index === current ? ' product__category-item--active' : '')}>{item.category}</View>
          ))
        }
      </View>
      <ScrollView
        className='product__list'
        scrollY={canPan}
        compileMode
        usingSticky
        onScrollToUpper={() => {
          setCanPan(false)
        }}
      >
        {
          data.map((item, index) => (
            <View className='product__list-section'>
              <View className='product__list-section--title' dataId={index}>{item.category}</View>
              {item.products.map(item => (
                <View className='product__card'>
                  <Image className='product__card-img' src={item.image}></Image>
                  <View className='product__card-content'>
                    <View className='product__card-name'>{item.name}</View>
                    <View className='product__card-comment'>{item.comment}</View>
                    <View className='product__card-group'>
                      <Text className='product__card-sales'>{item.sales}人学过</Text>
                      <Text className='product__card-rate'>好评度{item.rate}%</Text>
                    </View>
                    <View className='product__card-price'><Text>￥</Text><Text className='product__card-price-num'>{item.price}</Text><Text style={{ color: 'grey' }}>起</Text></View>
                  </View>
                </View>
              ))}
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
}

export default function Index() {
  return (
    <View compileMode>
      <Script src='./animation.wxs' module='ani'></Script>
      <ScrollView
        scrollY
        className='page'
        enhanced
        bounces={false}
        showScrollbar={false}
        upperThreshold={30}
        onScrollToUpper={ani.toupper}
      >
        <View className='index' onTouchStart={ani.touchstart} onTouchMove={ani.touchmove} onTouchEnd={ani.touchend}>
          <Image className='bg' src="https://res.wx.qq.com/op_res/6eQ8-k5PlDq7oIfHRTI1-ypWYiTfqCEMVGNUfVixvh1WCMXbQsPi5NSd9dlpzweXM_meCc7diXE5ZinaY-Fo-A" />
          <Content></Content>
        </View>
      </ScrollView>
    </View>
  )
}
