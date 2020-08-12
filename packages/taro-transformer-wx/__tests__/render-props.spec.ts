import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom, prettyPrint } from './utils'

describe('render props', () => {
  test('从 props 而来的函数', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const {goods } = this.props;

      return (
        <View
        >
              {goods.sku_type && (
                  <View>
                    {goods.replace('')}
                  </View>
                )}
        </View>
      )
      `, `coverView = [];text = []`)
    })
    // console.log(instance)
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block wx:if="{{goods.sku_type}}">
                  <view>{{anonymousState__temp}}</view>
              </block>
          </view>
      </block>
    `)
    )
  })

  test('从 props 而来的成员表达式函数', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const {goods } = this.props;

      return (
        <View
        >
              {goods.sku_type && (
                  <View>
                    {goods.sku_type.replace('')}
                  </View>
                )}
        </View>
      )
      `, `coverView = [];text = []`)
    })
    // console.log(instance)
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block wx:if="{{goods.sku_type}}">
                  <view>{{anonymousState__temp}}</view>
              </block>
          </view>
      </block>
    `)
    )
  })

  test('从 props 而来的 render props', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const {goods, renderGoods } = this.props;

      return (
        <View
        >
              {goods.sku_type && (
                  <View>
                    {renderGoods()}
                  </View>
                )}
        </View>
      )
      `, `coverView = [];text = []`)
    })
    // console.log(instance)
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block wx:if="{{goods.sku_type}}">
                  <view>
                    <slot name="goods"></slot>
                  </view>
              </block>
          </view>
      </block>
    `)
    )
  })

  test('从 props 而来的 render props 带参数', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const {goods, renderGoods } = this.props;

      return (
        <View
        >
              {goods.sku_type && (
                  <View>
                    {renderGoods(goods)}
                  </View>
                )}
        </View>
      )
      `, `coverView = [];text = []`)
    })
    // console.log(instance)
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block wx:if="{{goods.sku_type}}">
                  <view>
                    <slot name="goods"></slot>
                  </view>
              </block>
          </view>
      </block>
    `)
    )
  })

  test('从 props 多层解构而来的 render props 带参数', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const props = this.props
      const {goods, renderGoods } = props;

      return (
        <View
        >
              {goods.sku_type && (
                  <View>
                    {renderGoods(goods)}
                  </View>
                )}
        </View>
      )
      `, `coverView = [];text = []`)
    })
    // console.log(instance)
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block wx:if="{{goods.sku_type}}">
                  <view>
                    <slot name="goods"></slot>
                  </view>
              </block>
          </view>
      </block>
    `)
    )
  })

  test('fix #7315', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const {renderHeader, renderFooter} = this.props

      return (
        <View>
          <Block>{renderHeader}</Block>
          <Block>{renderFooter}</Block>
        </View>
      )
      `, ``)
    })
    expect(template).toMatch(
      prettyPrint(`
      <block>
          <view>
              <block>
                  <slot name="header"></slot>
              </block>
              <block>
                  <slot name="footer"></slot>
              </block>
          </view>
      </block>
    `)
    )
  })
})
