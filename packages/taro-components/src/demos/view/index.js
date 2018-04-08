import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/view/index.md'
export default function () {
  return (
    <Taro.View>
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.Text>view</Taro.Text>
          </Taro.View>
          <Taro.View className='page__desc'>
            <Taro.Text>视图容器</Taro.Text>
          </Taro.View>
        </Taro.View>
        <Taro.View className='page__con'>
          <Taro.View className='page__con__list'>
            <Taro.View className='page__con__title'>
              flex-direction: row
            </Taro.View>

            <Taro.View style='height: 100px;display: flex;'>
              <Taro.View className='view__flex-item'>1</Taro.View>
              <Taro.View
                className='view__flex-item'
                style='background-color: #FF6064'
              >
                2
              </Taro.View>
              <Taro.View
                className='view__flex-item'
                style='background-color: #00AEFB'
              >
                3
              </Taro.View>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con__list'>
            <Taro.View className='page__con__title'>
              flex-direction: column
            </Taro.View>

            <Taro.View style='height: 300px;flex-direction:column;display: flex;'>
              <Taro.View className='view__flex-item'>1</Taro.View>
              <Taro.View
                className='view__flex-item'
                style='background-color: #FF6064'
              >
                2
              </Taro.View>
              <Taro.View
                className='view__flex-item'
                style='background-color: #00AEFB'
              >
                3
              </Taro.View>
            </Taro.View>
          </Taro.View>
        </Taro.View>
      </Taro.View>
      <Taro.View className='markdown'>
        <Doc />
      </Taro.View>
    </Taro.View>
  )
}
