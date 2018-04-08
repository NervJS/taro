import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/rich-text/index.md'

export default class RichText extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      nodes: [
        {
          name: 'div',
          attrs: {
            class: 'div_class',
            style: 'color: red;'
          },
          children: [
            {
              type: 'text',
              text: 'HelloWorld!'
            }
          ]
        },
        {
          name: 'div',
          attrs: {
            class: 'div_class',
            style: 'color: blue;'
          },
          children: [
            {
              name: 'div',
              attrs: {
                class: 'div_class',
                style: ''
              },
              children: [
                {
                  type: 'text',
                  text: 'test'
                }
              ]
            }
          ]
        }
      ],
      string: '<span>string nodes: love</span>'
    }
  }

  render () {
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.View>
                <Taro.Text>rich-text</Taro.Text>
              </Taro.View>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.RichText nodes={this.state.nodes} />
            <Taro.RichText nodes={this.state.string} />
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
