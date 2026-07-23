import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  render () {
    return (
      <View className='container'>
        <View>Level 1</View>
        <View>
          <View>
            <View>
              <View>
                <View>
                  <View>
                    <View>
                      <View>
                        <View>
                          <View>
                            <View>
                              <View>
                                <View>
                                  <View>
                                    <View>
                                      <View>
                                        <View>
                                          <View>
                                            <View>
                                              <View>
                                                <Text className='red-text'>Level 21 - Should be RED</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
