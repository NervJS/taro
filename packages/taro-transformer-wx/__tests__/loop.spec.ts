import transform from '../src'
import { LOOP_STATE } from '../src/constant'
import {
  buildComponent,
  baseOptions,
  evalClass,
  removeShadowData,
  prettyPrint
} from './utils'

describe('loop', () => {
  describe('有 block 有 return', () => {
    describe('多层 loop', () => {
      test('简单情况', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => <Text>{item2}</Text>)}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for="{{array}}" wx:for-item="item">
                      <text wx:for="{{item.list}}" wx:for-item="item2">{{item2}}</text>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      describe('动态创建 callee', () => {
        test('callee 动态创建', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              return (
                <View>{Array.from({ length: 9 }).map((e, i) => {
                  return (
                    <View
                      key={i}
                      className="ratio-16-9 image-company-album"
                    >
                      loop1: {i}
                      {Array.from({ length: 9 }).map((el, j) => {
                        return (
                          <View
                            key={j}
                            className="ratio-16-9 image-company-album"
                          >
                            loop2: {j}
                          </View>
                        )
                      })}
                    </View>
                  )
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBeLessThanOrEqual(2)
          expect(instance.state.loopArray0[0].$anonymousCallee__0.length).toBe(
            9
          )

          expect(template).toMatch(
            prettyPrint(
              `
            <block>
                <view>
                    <view wx:key="i" class="ratio-16-9 image-company-album" wx:for="{{loopArray0}}" wx:for-item="e" wx:for-index="i">loop1: {{i}}
                        <view wx:key="j" class="ratio-16-9 image-company-album" wx:for="{{e.$anonymousCallee__0}}" wx:for-item="el" wx:for-index="j">loop2: {{j}}</view>
                    </view>
                </view>
            </block>
            `
            )
          )
        })

        test('支持条件表达式的 consequent 为空', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const arr1 = []
              return (
                <View>{Array.from({length: 9}).map((e, i) => {
                  return (
                    arr1.length > 1 ? null :
                    <View
                      key={i}
                      className="ratio-16-9 image-company-album"
                    >
                      loop1: {i}
                    </View>
                  )
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBeLessThanOrEqual(2)
          expect(instance.state.$anonymousCallee__0.length).toBe(9)
          expect(template).toMatch(
            prettyPrint(
              `
            <block>
                <view>
                    <block wx:if=\"{{!(arr1.length > 1)}}\" wx:for=\"{{$anonymousCallee__0}}\" wx:for-item=\"e\" wx:for-index=\"i\" wx:key=\"i\">
                        <view class=\"ratio-16-9 image-company-album\">loop1: {{i}}</view>
                    </block>
                </view>
            </block>
            `
            )
          )
        })

        test('支持条件表达式的 test 可以使用复杂表达式', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              return (
                <View>{Array.from({length: 9}).map((e, i) => {
                  return (
                    Array.from({length: 9}).length > 1 ? null :
                    <View
                      key={i}
                      className="ratio-16-9 image-company-album"
                    >
                      loop1: {i}
                    </View>
                  )
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBeLessThanOrEqual(2)
          expect(instance.state.loopArray0[0].$loopState__temp2).toBe(true)
          expect(template).toMatch(
            prettyPrint(
              `
            <block>
                <view>
                    <block wx:if=\"{{!e.$loopState__temp2}}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"e\" wx:for-index=\"i\" wx:key=\"i\">
                        <view class=\"ratio-16-9 image-company-album\">loop1: {{i}}</view>
                    </block>
                </view>
            </block>
            `
            )
          )
        })

        test('calee 之前可以使用逻辑表达式', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              return (
                <View>{Array.from({length: 9}).length === 0 ? null : Array.from({length: 9}).map((e, i) => {
                  return (
                    <View
                      key={i}
                      className="ratio-16-9 image-company-album"
                    >
                      loop1:{i}
                    </View>
                  )
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBeLessThanOrEqual(2)
          expect(instance.state.anonymousState__temp).toBe(false)
          expect(template).toMatch(
            prettyPrint(
              `
            <block>
            <view>
                <block>
                    <block wx:if=\"{{anonymousState__temp}}\">
                        <view></view>
                    </block>
                    <block wx:else>
                        <view wx:key=\"i\" class=\"ratio-16-9 image-company-album\" wx:for=\"{{$anonymousCallee__0}}\" wx:for-item=\"e\" wx:for-index=\"i\">loop1:{{i}}</view>
                    </block>
                </block>
            </view>
        </block>
            `
            )
          )
        })

        test('calee 之前可以使用逻辑表达式 2', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const b1 = true
              const a1 = Array.from({length: 1})
              const a2 = Array.from({length: 2})
              const a3 = Array.from({length: 9})
              return (
                <View>{a1.length === 0 ? null : a2.map((e, i) => {
                  return (
                    <View
                      key={i}
                      className="ratio-16-9 image-company-album"
                    >
                      loop1: {i}
                      {b1 ? null : a3.map((e, i) => {
                        return (
                          <View
                            key={i}
                            className="ratio-16-9 image-company-album"
                          >
                            loop1: {i}
                          </View>
                        )
                      })}
                    </View>
                  )
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(4)
          expect(template).toMatch(
            prettyPrint(
              `
            <block>
            <view>
                <block>
                    <block wx:if=\"{{a1.length === 0}}\">
                        <view></view>
                    </block>
                    <block wx:else>
                        <view wx:key=\"i\" class=\"ratio-16-9 image-company-album\" wx:for=\"{{a2}}\" wx:for-item=\"e\" wx:for-index=\"i\">loop1: {{i}}
                            <block>
                                <block wx:if=\"{{b1}}\">
                                    <view></view>
                                </block>
                                <block wx:else>
                                    <view wx:key=\"i\" class=\"ratio-16-9 image-company-album\" wx:for=\"{{a3}}\"
                                    wx:for-item=\"e\" wx:for-index=\"i\">loop1: {{i}}</view>
                                </block>
                            </block>
                        </view>
                    </block>
                </block>
            </view>
        </block>
            `
            )
          )
        })
      })

      test('支持逻辑表达式', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => b1 && <Text>{item2}</Text>)}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{item.list}}\" wx:for-item=\"item2\">
                          <text>{{item2}}</text>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持逻辑表达式2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <Text />
                  </View>
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(3)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{item.list}}\" wx:for-item=\"item2\">
                          <view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持逻辑表达式3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                    </CoverView>
                  </View>
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(3)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{item.list}}\" wx:for-item=\"item2\">
                          <view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <cover-view>
                                  <text></text>
                              </cover-view>
                          </view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持逻辑表达式3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                    </CoverView>
                    {b3 && <Progress />}
                  </View>
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{item.list}}\" wx:for-item=\"item2\">
                          <view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <cover-view>
                                  <text></text>
                              </cover-view>
                              <block wx:if=\"{{b3}}\">
                                  <progress></progress>
                              </block>
                          </view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持逻辑表达式4', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(item => {
                return <CoverView>{item.list.map(item2 => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </View>
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{item.list}}\" wx:for-item=\"item2\">
                          <view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <cover-view>
                                  <text></text>
                                  <block wx:if=\"{{b4}}\">
                                      <button></button>
                                  </block>
                              </cover-view>
                              <block wx:if=\"{{b3}}\">
                                  <progress></progress>
                              </block>
                          </view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持条件表达式', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>{arr.list.map(item => {
                  return b1 ? <Text>{item}</Text> : <View />
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(2)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <block wx:if=\"{{b1}}\">
                              <text>{{item}}</text>
                          </block>
                          <block wx:else>
                              <view></view>
                          </block>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持条件表达式2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>{arr.list.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <CoverView>
                    <Text />
                  </CoverView>
                  </CoverView> : null
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(3)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <cover-view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <cover-view>
                                  <text></text>
                              </cover-view>
                          </cover-view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持条件表达式2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>{arr.list.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                  </CoverView> : null
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(3)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <cover-view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </cover-view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持条件表达式2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>{arr.list.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                  </CoverView> : null
                })}</CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(3)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <cover-view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </cover-view>
                      </block>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持条件表达式2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>
                {arr.list.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                  </CoverView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <cover-view>
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </cover-view>
                      </block>
                      <view>
                          <block wx:if=\"{{b4}}\">
                              <image/>
                          </block>
                      </view>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持写方法', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>
                {arr.list.map(item => {
                  return b1 ? <ScrollView onClick={this.handleClick} >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <scroll-view bindtap=\"handleClick\">
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </scroll-view>
                      </block>
                      <view>
                          <block wx:if=\"{{b4}}\">
                              <image/>
                          </block>
                      </view>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持写 props.method', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>
                {arr.list.map(item => {
                  return b1 ? <ScrollView onClick={this.props.onClick} >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <scroll-view bindtap=\"funPrivate1\">
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </scroll-view>
                      </block>
                      <view>
                          <block wx:if=\"{{b4}}\">
                              <image/>
                          </block>
                      </view>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持写 bind', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>
                {arr.list.map(item => {
                  return b1 ? <ScrollView onClick={this.onClick.bind(this, null)} >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                          <scroll-view bindtap=\"onClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{null}}\">
                              <block wx:if=\"{{b2}}\">
                                  <map></map>
                              </block>
                              <text></text>
                          </scroll-view>
                      </block>
                      <view>
                          <block wx:if=\"{{b4}}\">
                              <image/>
                          </block>
                      </view>
                  </cover-view>
              </view>
          </block>
          `
          )
        )
      })

      test('支持写 bind 2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView>
                {arr.list.map(item => {
                  return b1 ? <ScrollView onClick={this.props.onClick.bind(this, null)} >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
        <view>
            <cover-view wx:for=\"{{array}}\" wx:for-item=\"arr\">
                <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                    <scroll-view bindtap=\"funPrivate2\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{null}}\">
                        <block wx:if=\"{{b2}}\">
                            <map></map>
                        </block>
                        <text></text>
                    </scroll-view>
                </block>
                <view>
                    <block wx:if=\"{{b4}}\">
                        <image/>
                    </block>
                </view>
            </cover-view>
        </view>
    </block>
          `
          )
        )
      })

      test.skip('支持字符串模板', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [{}] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView key={String(arr)}>
                {arr.list.map(item => {
                  return b1 ? <ScrollView className={\`test\`} >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [{}] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
        <view>
            <cover-view wx:key=\"arr.$loopState__temp2\"  wx:for=\"{{loopArray0}}\" wx:for-item=\"arr\">
                <block wx:if=\"{{b1}}\" wx:for=\"{{arr.$original.list}}\" wx:for-item=\"item\">
                    <scroll-view class=\"test\">
                        <block wx:if=\"{{b2}}\">
                            <map></map>
                        </block>
                        <text></text>
                    </scroll-view>
                </block>
                <view>
                    <block wx:if=\"{{b4}}\">
                        <image/>
                    </block>
                </view>
            </cover-view>
        </view>
    </block>
          `
          )
        )
      })

      test.skip('支持字符串模板2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [{}] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return <CoverView className={\`test\`}>
                {arr.list.map(item => {
                  return b1 ? <ScrollView >
                    {b2 ? <Map /> : null}
                    <Text />
                  </ScrollView> : null
                })}
                <View>
                  {b4 && <Image />}
                </View>
                </CoverView>
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.loopArray0).toEqual(undefined)
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
          <view>
              <cover-view class=\"test\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                  <block wx:if=\"{{b1}}\" wx:for=\"{{arr.list}}\" wx:for-item=\"item\">
                      <scroll-view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <text></text>
                      </scroll-view>
                  </block>
                  <view>
                      <block wx:if=\"{{b4}}\">
                          <image/>
                      </block>
                  </view>
              </cover-view>
          </view>
      </block>
          `
          )
        )
      })
    })
    describe('一层 loop', () => {
      test('简单情况', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => {
                return <View>{item}</View>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(
          `<view wx:for="{{array}}" wx:for-item="item">{{item}}</view>`
        )
        expect(Object.keys(instance.state).length).toBe(1)
        expect(instance.state.array).toEqual(['test1', 'test2', 'test3'])
      })

      test('支持条件表达式3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(4)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
            <view>
                <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                    <cover-view>
                        <block wx:if=\"{{b2}}\">
                            <map></map>
                        </block>
                        <text></text>
                        <block wx:if=\"{{b3}}\">
                            <progress></progress>
                        </block>
                    </cover-view>
                </block>
            </view>
        </block>
          `
          )
        )
      })

      test('支持条件表达式4', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      test('能使用方法', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick}>
                    {b2 ? <Map /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
                <view>
                    <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                        <cover-view bindtap=\"handleClick\">
                            <block wx:if=\"{{b2}}\">
                                <map></map>
                            </block>
                            <text></text>
                            <cover-view>
                                <text></text>
                                <block wx:if=\"{{b4}}\">
                                    <button></button>
                                </block>
                            </cover-view>
                            <block wx:if=\"{{b3}}\">
                                <progress></progress>
                            </block>
                        </cover-view>
                    </block>
                </view>
            </block>
          `
          )
        )
      })

      test('能使用方法2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick}>
                    {b2 ? <Map onClick={this.handleClick} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view bindtap=\"handleClick\">
                          <block wx:if=\"{{b2}}\">
                              <map bindtap=\"handleClick\"></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      test('能使用bind', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick.bind(this)}>
                    {b2 ? <Map onClick={this.handleClick} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view bindtap=\"handleClick\" data-e-tap-so=\"this\">
                          <block wx:if=\"{{b2}}\">
                              <map bindtap=\"handleClick\"></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      test('能使用bind 2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick.bind(this, b1)}>
                    {b2 ? <Map onClick={this.handleClick} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view bindtap=\"handleClick\" data-e-tap-so=\"this\"
                      data-e-tap-a-a=\"{{b1}}\">
                          <block wx:if=\"{{b2}}\">
                              <map bindtap=\"handleClick\"></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      test('能使用bind 3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick.bind(this, b1)}>
                    {b2 ? <Map onClick={this.handleClick.bind(this, b2)} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
        <view>
            <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                <cover-view bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b1}}\">
                    <block wx:if=\"{{b2}}\">
                        <map bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></map>
                    </block>
                    <text></text>
                    <cover-view>
                        <text></text>
                        <block wx:if=\"{{b4}}\">
                            <button></button>
                        </block>
                    </cover-view>
                    <block wx:if=\"{{b3}}\">
                        <progress></progress>
                    </block>
                </cover-view>
            </block>
        </view>
    </block>
          `
          )
        )
      })

      test('能使用bind 3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.handleClick.bind(this, b1)}>
                    {b2 ? <Map onClick={this.handleClick.bind(this, b2)} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button onClick={this.handleClick.bind(this, b2)} />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
        <view>
            <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                <cover-view bindtap=\"handleClick\" data-e-tap-so=\"this\"
                data-e-tap-a-a=\"{{b1}}\">
                    <block wx:if=\"{{b2}}\">
                        <map bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></map>
                    </block>
                    <text></text>
                    <cover-view>
                        <text></text>
                        <block wx:if=\"{{b4}}\">
                            <button bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></button>
                        </block>
                    </cover-view>
                    <block wx:if=\"{{b3}}\">
                        <progress></progress>
                    </block>
                </cover-view>
            </block>
        </view>
    </block>
          `
          )
        )
      })

      test('能使用this.props.${event}.bind', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: false,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.props.onClick}>
                    {b2 ? <Map onClick={this.handleClick.bind(this, b2)} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button onClick={this.handleClick.bind(this, b2)} />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
          <view>
              <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                  <cover-view bindtap=\"funPrivate3\">
                      <block wx:if=\"{{b2}}\">
                          <map bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></map>
                      </block>
                      <text></text>
                      <cover-view>
                          <text></text>
                          <block wx:if=\"{{b4}}\">
                              <button bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></button>
                          </block>
                      </cover-view>
                      <block wx:if=\"{{b3}}\">
                          <progress></progress>
                      </block>
                  </cover-view>
              </block>
          </view>
      </block>
          `
          )
        )
      })

      test('能使用this.props.${event}.bind 2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: false,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.props.onCoverClick.bind(this, b1)}>
                    {b2 ? <Map onClick={this.props.onMapCick.bind(this, b2)} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button onClick={this.handleClick.bind(this, b2)} />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view bindtap=\"funPrivate4\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b1}}\">
                          <block wx:if=\"{{b2}}\">
                              <map bindtap=\"funPrivate5\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      test('能使用this.props.${event}.bind 3', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: false,
          code: buildComponent(
            `
            const array = [{ list: [] }]
            const b1 = true
            const b2 = true
            const b3 = true
            const b4 = true
            return (
              <View>{array.map(arr => {
                return b1 ? <CoverView onClick={this.props.onCoverClick.bind(this, b1)}>
                    {b2 ? <Map onClick={this.props.onMapCick.bind(this, b2)} /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button onClick={this.handleClick.bind(this, b2)} />}
                    </CoverView>
                    {b3 && <Progress onClick={this.props.onProgressClick.bind(this, b2)} />}
                  </CoverView> : null
              })}</View>
            )
          `,
            `handleClick = () => ({})`
          )
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        expect(Object.keys(instance.state).length).toBe(5)
        expect(instance.state.array).toEqual([{ list: [] }])
        expect(template).toMatch(
          prettyPrint(
            `
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"arr\">
                      <cover-view bindtap=\"funPrivate6\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b1}}\">
                          <block wx:if=\"{{b2}}\">
                              <map bindtap=\"funPrivate7\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></map>
                          </block>
                          <text></text>
                          <cover-view>
                              <text></text>
                              <block wx:if=\"{{b4}}\">
                                  <button bindtap=\"handleClick\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></button>
                              </block>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress bindtap=\"funPrivate8\" data-e-tap-so=\"this\" data-e-tap-a-a=\"{{b2}}\"></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
          `
          )
        )
      })

      describe('支持写逻辑表达式', () => {
        test('简单情况', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const bool = true
              return (
                <View>{array.map(item => { return bool && <View>{item}</View> })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          const stateName = Object.keys(instance.state)[0]
          expect(template).toMatch(
            prettyPrint(`
          <block>
              <view>
                  <block wx:if=\"{{bool}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <view>{{item}}</view>
                  </block>
              </view>
          </block>
          `)
          )
        })

        test('子元素有逻辑表达式', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              return (
                <View>{array.map(item => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <Text />
                  </View>
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(3)
          expect(template).toMatch(
            prettyPrint(`
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <text></text>
                      </view>
                  </block>
              </view>
          </block>
          `)
          )
        })

        test('子元素有条件表达式', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(
              `
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              const { activeIndex } = this.state
              return (
                <View>{array.map((item, index) => {
                  return this.state.list[activeIndex] === 'trip' ?
                  (
                    <Navigator
                      key={index}
                    >
                    <View>1</View>
                    </Navigator>
                  ) : (
                    <Navigator
                      key={item.id}
                    >
                    <View>2</View>
                    </Navigator>
                  );
                })}</View>
              )
            `,
              `state = { activeIndex: 0, list: [] }`
            )
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(4)
          expect(template).toMatch(
            prettyPrint(`
          <block>
              <view>
                  <block wx:for=\"{{loopArray0}}\" wx:for-item=\"item\" wx:for-index=\"index\"
                  wx:key=\"index\">
                      <block wx:if=\"{{item.$loopState__temp2}}\">
                          <navigator>
                              <view>1</view>
                          </navigator>
                      </block>
                      <block wx:else>
                          <navigator wx:key=\"$original.id\">
                              <view>2</view>
                          </navigator>
                      </block>
                  </block>
              </view>
          </block>
          `)
          )
        })

        test('子元素有逻辑表达式2', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              return (
                <View>{array.map(item => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                    </CoverView>
                  </View>
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(3)
          expect(template).toMatch(
            prettyPrint(`
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <cover-view>
                              <text></text>
                          </cover-view>
                      </view>
                  </block>
              </view>
          </block>
          `)
          )
        })

        test('子元素有逻辑表达式3', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              const b3 = true
              return (
                <View>{array.map(item => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                    </CoverView>
                    {b3 && <Progress />}
                  </View>
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(4)
          expect(template).toMatch(
            prettyPrint(`
          <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <cover-view>
                              <text></text>
                          </cover-view>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </view>
                  </block>
              </view>
          </block>
          `)
          )
        })

        test('子元素有逻辑表达式4', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              const b3 = true
              const b4 = true
              return (
                <View>{array.map(item => {
                  return b1 && <View>
                    {b2 && <Map />}
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </View>
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(5)
          expect(template).toMatch(
            prettyPrint(`
            <block>
                <view>
                    <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                        <view>
                            <block wx:if=\"{{b2}}\">
                                <map></map>
                            </block>
                            <cover-view>
                                <text></text>
                                <block wx:if=\"{{b4}}\">
                                    <button></button>
                                </block>
                            </cover-view>
                            <block wx:if=\"{{b3}}\">
                                <progress></progress>
                            </block>
                        </view>
                    </block>
                </view>
            </block>
          `)
          )
        })
      })

      describe('支持条件表达式', () => {
        test('简单情况', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const bool = true
              return (
                <View>{array.map(item => {
                  return bool ? <Text>{item}</Text> : <View />
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(2)
          expect(template).toMatch(
            prettyPrint(`
            <block>
                <view>
                    <block wx:for="{{array}}" wx:for-item="item">
                        <block wx:if="{{bool}}">
                            <text>{{item}}</text>
                        </block>
                        <block wx:else>
                            <view></view>
                        </block>
                    </block>
                </view>
            </block>
            `)
          )
        })

        test('子元素', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              return (
                <View>{array.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <CoverView>
                    <Text />
                  </CoverView>
                  </CoverView> : null
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(3)
          expect(template).toMatch(
            prettyPrint(`
            <block>
                <view>
                    <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                        <cover-view>
                            <block wx:if=\"{{b2}}\">
                                <map></map>
                            </block>
                            <cover-view>
                                <text></text>
                            </cover-view>
                        </cover-view>
                    </block>
                </view>
            </block>
            `)
          )
        })

        test('子元素2', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              return (
                <View>{array.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                  </CoverView> : null
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(3)
          expect(template).toMatch(
            prettyPrint(`
            <block>
                <view>
                    <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                        <cover-view>
                            <block wx:if=\"{{b2}}\">
                                <map></map>
                            </block>
                            <text></text>
                        </cover-view>
                    </block>
                </view>
            </block>
            `)
          )
        })

        test('子元素3', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              const b3 = true
              return (
                <View>{array.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                    {b3 && <Progress />}
                  </CoverView> : null
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(4)
          expect(template).toMatch(
            prettyPrint(`
            <block>
              <view>
                  <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                      <cover-view>
                          <block wx:if=\"{{b2}}\">
                              <map></map>
                          </block>
                          <text></text>
                          <block wx:if=\"{{b3}}\">
                              <progress></progress>
                          </block>
                      </cover-view>
                  </block>
              </view>
          </block>
            `)
          )
        })

        test('子元素4', () => {
          const { template, ast, code } = transform({
            ...baseOptions,
            isRoot: true,
            code: buildComponent(`
              const array = ['test1', 'test2', 'test3']
              const b1 = true
              const b2 = true
              const b3 = true
              const b4 = true
              return (
                <View>{array.map(item => {
                  return b1 ? <CoverView>
                    {b2 ? <Map /> : null}
                    <Text />
                    <CoverView>
                      <Text />
                      {b4 && <Button />}
                    </CoverView>
                    {b3 && <Progress />}
                  </CoverView> : null
                })}</View>
              )
            `)
          })

          const instance = evalClass(ast)
          removeShadowData(instance.state)
          expect(Object.keys(instance.state).length).toBe(5)

          expect(template).toMatch(
            prettyPrint(`
            <block>
                <view>
                    <block wx:if=\"{{b1}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">
                        <cover-view>
                            <block wx:if=\"{{b2}}\">
                                <map></map>
                            </block>
                            <text></text>
                            <cover-view>
                                <text></text>
                                <block wx:if=\"{{b4}}\">
                                    <button></button>
                                </block>
                            </cover-view>
                            <block wx:if=\"{{b3}}\">
                                <progress></progress>
                            </block>
                        </cover-view>
                    </block>
                </view>
            </block>
            `)
          )
        })
      })

      test('有 template string', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => {
                return <View>{String(item)}</View>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(
          `<view wx:for="{{loopArray0}}" wx:for-item="item">{{item.$loopState`
        )
        expect(
          instance.state.loopArray0.some(a => {
            for (const key in a) {
              if (key.startsWith(LOOP_STATE)) {
                return true
              }
            }
            return false
          })
        ).toBeTruthy()
      })

      test('循环内 children 有函数', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => {
                return <View>{escape(item)}</View>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        // const stateName = Object.keys(instance.state)[0]

        expect(template).toMatch(
          `<view wx:for="{{loopArray0}}" wx:for-item="item">{{item.$loopState`
        )
        expect(
          instance.state.loopArray0.some(a => {
            for (const key in a) {
              if (key.startsWith(LOOP_STATE)) {
                return true
              }
            }
            return false
          })
        ).toBeTruthy()
        // expect(Object.keys(instance.state).length).toBe(1)
        // expect(instance.state[stateName]).toEqual(['test1'])
      })

      test('循环内 children props 有函数', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => {
                return <View className={escape(item)}/>
              })}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(
          `<view class="{{item.$loopState__temp2}}" wx:for="{{loopArray0}}" wx:for-item="item"></view>`
        )
        expect(
          instance.state.loopArray0.some(a => {
            for (const key in a) {
              if (key.startsWith(LOOP_STATE)) {
                return true
              }
            }
            return false
          })
        ).toBeTruthy()
      })
    })
  })

  describe('当有复杂表达式或循环体内有函数，item 单独使用时保留一份 item 的副本', () => {
    test('no return', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = ['test1', 'test2', 'test3']
          const bool = true
          return (
            <View>{array.map(item => bool && <View className={String('name')}>{item}</View>)}</View>
          )
        `)
      })

      const instance = evalClass(ast)
      removeShadowData(instance.state)

      expect(template).toMatch(
        prettyPrint(`
        <block>
            <view>
                <block wx:if=\"{{bool}}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"item\">
                    <view class=\"{{item.$loopState__temp2}}\">{{item.$original}}</view>
                </block>
            </view>
        </block>
      `)
      )
      expect(Object.keys(instance.state).length).toBeLessThanOrEqual(3)
      expect(instance.state.loopArray0.map(i => i.$original)).toEqual([
        'test1',
        'test2',
        'test3'
      ])
    })

    test('return', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = ['test1', 'test2', 'test3']
          const bool = true
          return (
            <View>{array.map(item => {
              return bool && <View className={String('name')}>{item}</View>
            })}</View>
          )
        `)
      })

      const instance = evalClass(ast)
      removeShadowData(instance.state)

      expect(template).toMatch(
        prettyPrint(`
        <block>
            <view>
                <block wx:if=\"{{bool}}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"item\">
                    <view class=\"{{item.$loopState__temp2}}\">{{item.$original}}</view>
                </block>
            </view>
        </block>
      `)
      )
      expect(Object.keys(instance.state).length).toBeLessThanOrEqual(3)
      expect(instance.state.loopArray0.map(i => i.$original)).toEqual([
        'test1',
        'test2',
        'test3'
      ])
    })
  })

  describe('没有 block 包住', () => {
    describe('一层 loop', () => {
      test('简单情况', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            const bool = true
            return (
              <View>{array.map(item => bool && <View>{item}</View>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(
          `<block wx:if=\"{{bool}}\" wx:for=\"{{array}}\" wx:for-item=\"item\">`
        )
        expect(Object.keys(instance.state).length).toBe(2)
        expect(instance.state.array).toEqual(['test1', 'test2', 'test3'])
      })

      test('循环内 children props 有函数', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <View className={escape(item)}/>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(
          `<view class="{{item.$loopState__temp2}}" wx:for="{{loopArray0}}" wx:for-item="item"></view>`
        )
        expect(
          instance.state.loopArray0.some(a => {
            for (const key in a) {
              if (key.startsWith(LOOP_STATE)) {
                return true
              }
            }
            return false
          })
        ).toBeTruthy()
      })

      test('能使用 key', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <Custom key={item}>{item}</Custom>)}</View>
            )
          `,
            ``,
            `import { Custom } from './utils'`
          )
        })

        expect(template).toMatch(`wx:key="item"`)
      })

      test('能使用 key 2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(
            `
            const array = [{id: 1}, {id: 2}, {id: 3}]
            return (
              <View>{array.map(item => <Custom key={item.id} />)}</View>
            )
          `,
            ``,
            `import { Custom } from './utils'`
          )
        })

        expect(template).toMatch(`wx:key="id"`)
      })

      test('callee 支持复杂表达式', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.slice(0, 1).map(item => <View>{item}</View>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        const stateName = Object.keys(instance.state)[0]

        expect(template).toMatch(
          `<view wx:for="{{${stateName}}}" wx:for-item="item">{{item}}</view>`
        )
        expect(Object.keys(instance.state).length).toBe(1)
        expect(instance.state[stateName]).toEqual(['test1'])
      })

      test('callee 支持复杂表达式 2', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <View>{escape(item)}</View>)}</View>
            )
          `)
        })
        const instance = evalClass(ast)
        removeShadowData(instance.state)
        // const stateName = Object.keys(instance.state)[0]

        expect(template).toMatch(
          `<view wx:for="{{loopArray0}}" wx:for-item="item">{{item.$loopState`
        )
        expect(
          instance.state.loopArray0.some(a => {
            for (const key in a) {
              if (key.startsWith(LOOP_STATE)) {
                return true
              }
            }
            return false
          })
        ).toBeTruthy()
        // expect(Object.keys(instance.state).length).toBe(1)
        // expect(instance.state[stateName]).toEqual(['test1'])
      })
    })
  })

  describe('含有语句或复杂表达式的循环', () => {
    test('callee 是复杂表达式', () => {
      const keys = {
        颜色: {
          红: { active: false, disabled: false, name: '红' },
          蓝: { active: false, disabled: false, name: '蓝' }
        },
        大小: {
          M: { active: false, disabled: false, name: 'M' },
          L: { active: false, disabled: false, name: 'L' }
        }
      }
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(
          `
          const { keys } = this.state
          return (
              Object.keys(keys).map((key, index) => {
                  const ks = Object.keys(keys[key])
                  return (
                      <View key={index}>
                          <View>{key}</View>
                          {
                              ks.map((value, id) => {
                                  const title = 'title'
                                  return (
                                      <View key={id}>{value}</View>
                                  )
                              })
                          }
                      </View>
                  )
              })
          )
          `,
          `state = {
            keys: {
          '颜色': {
            '红': {active: false, disabled: false, name: '红'},
            '蓝': {active: false, disabled: false, name: '蓝'}
          },
          '大小': {
            'M': {active: false, disabled: false, name: 'M'},
            'L': {active: false, disabled: false, name: 'L'}
          }
        }
          }`
        )
      })

      const instance = evalClass(ast)
      removeShadowData(instance.state)
      expect(instance.state.loopArray0.length).toBe(2)
      expect(instance.state.loopArray0.map(i => i.$original)).toEqual([
        '颜色',
        '大小'
      ])
      expect(
        instance.state.loopArray0.map(i =>
          i.$anonymousCallee__1.map(a => a.$original)
        )
      ).toEqual(Object.keys(keys).map(key => Object.keys(keys[key]).map(i => i)))
      expect(template).toMatch(
        prettyPrint(`
          <block>
              <view wx:key="index" wx:for="{{loopArray0}}" wx:for-item="key" wx:for-index="index">
                  <view>{{key.$original}}</view>
                  <view wx:key="id" wx:for="{{key.$anonymousCallee__1}}" wx:for-item="value" wx:for-index="id">{{value.$original}}</view>
              </view>
          </block>
      `)
      )
    })

    test('callee 是复杂表达式, 第二个循环非复杂表达式', () => {
      const keys = {
        颜色: {
          红: { active: false, disabled: false, name: '红' },
          蓝: { active: false, disabled: false, name: '蓝' }
        },
        大小: {
          M: { active: false, disabled: false, name: 'M' },
          L: { active: false, disabled: false, name: 'L' }
        }
      }
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(
          `
          const { keys } = this.state
          return (
              Object.keys(keys).map((key, index) => {
                  const ks = Object.keys(keys[key])
                  return (
                      <View key={index}>
                          <View>{key}</View>
                          {
                              ks.map((value, id) => {
                                  return (
                                      <View key={id}>{value}</View>
                                  )
                              })
                          }
                      </View>
                  )
              })
          )
          `,
          `state = {
            keys: {
          '颜色': {
            '红': {active: false, disabled: false, name: '红'},
            '蓝': {active: false, disabled: false, name: '蓝'}
          },
          '大小': {
            'M': {active: false, disabled: false, name: 'M'},
            'L': {active: false, disabled: false, name: 'L'}
          }
        }
          }`
        )
      })

      const instance = evalClass(ast)
      removeShadowData(instance.state)
      expect(instance.state.loopArray0.length).toBe(2)
      expect(instance.state.loopArray0.map(i => i.$original)).toEqual([
        '颜色',
        '大小'
      ])
      expect(instance.state.loopArray0.map(i => i.ks)).toEqual(
        Object.keys(keys).map(key => Object.keys(keys[key]).map(i => i))
      )
      expect(template).toMatch(
        prettyPrint(`
          <block>
              <view wx:key="index" wx:for="{{loopArray0}}" wx:for-item="key" wx:for-index="index">
                  <view>{{key.$original}}</view>
                  <view wx:key="id" wx:for="{{key.ks}}" wx:for-item="value" wx:for-index="id">{{value}}</view>
              </view>
          </block>
      `)
      )
    })
  })
})
