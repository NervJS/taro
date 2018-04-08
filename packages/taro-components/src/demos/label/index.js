import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Label extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      checkbox5Checked: false
    }
    this.btnHandleClick = this.btnHandleClick.bind(this)
  }

  btnHandleClick (e) {
    console.log('label btn click', e)
    this.setState({ checkbox5Checked: !this.state.checkbox5Checked })
  }

  render () {
    function handleChange (e) {
      console.log('label', e)
    }

    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.View>
              <Taro.Text>label</Taro.Text>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View className='page__con'>
          <Taro.View className='page__con__list'>
            <Taro.View className='page__con__title'>
              <Taro.Text>label checkbox</Taro.Text>
              <Taro.View>
                <Taro.Label
                  key='checkbox3'
                  type='checkbox'
                  color='#09bb07'
                  checked
                  onChange={handleChange}
                >
                  <Taro.Text>USA</Taro.Text>
                </Taro.Label>
              </Taro.View>
              <Taro.View>
                <Taro.Label
                  key='checkbox4'
                  type='checkbox'
                  color='#09bb07'
                  onChange={handleChange}
                >
                  <Taro.Text>CHN</Taro.Text>
                </Taro.Label>
              </Taro.View>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con__list'>
            <Taro.View className='page__con__title'>
              <Taro.Text>label radio</Taro.Text>
              <Taro.View>
                <Taro.Label
                  key='radio3'
                  type='radio'
                  name='radio1'
                  checked
                  onChange={handleChange}
                >
                  <Taro.Text>USA</Taro.Text>
                </Taro.Label>
              </Taro.View>
              <Taro.View>
                <Taro.Label
                  key='radio4'
                  type='radio'
                  name='radio1'
                  checked
                  onChange={handleChange}
                >
                  <Taro.Text>CHN</Taro.Text>
                </Taro.Label>
              </Taro.View>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con__list'>
            <Taro.View className='page__con__title'>
              <Taro.Text>按下时选择第一个</Taro.Text>
              <Taro.View>
                <Taro.Label
                  key='checkbox5'
                  type='checkbox'
                  checked={this.state.checkbox5Checked}
                  onChange={handleChange}
                >
                  <Taro.Text>选项1</Taro.Text>
                </Taro.Label>
              </Taro.View>
              <Taro.View>
                <Taro.Label
                  key='checkbox6'
                  type='checkbox'
                  checked
                  onChange={handleChange}
                >
                  <Taro.Text>选项2</Taro.Text>
                </Taro.Label>
              </Taro.View>
              <Taro.View>
                <Taro.Button
                  className='weui-btn weui-btn_primary'
                  hoverClass='red'
                  onclick={this.btnHandleClick}
                >
                  点击选择第一个
                </Taro.Button>
              </Taro.View>
            </Taro.View>
          </Taro.View>
        </Taro.View>
      </Taro.View>
    )
  }
}
