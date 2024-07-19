import React, { Component } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import region from './region'

export default class Index extends Component {
  state = {
    region: '请选择省市区',
    range: [],
    value: [0, 0, 0]
  }

  componentWillMount() {
    console.log('mount')
    let range = this.state.range
    let temp = []
    for (let i = 0; i < region.length; i++) {
      temp.push(region[i].name)
    }
    range.push(temp)
    temp = []
    for (let i = 0; i < region[0].city.length; i++) {
      temp.push(region[0].city[i].name)
    }
    range.push(temp)
    temp = []
    for (let i = 0; i < region[0].city[0].districtAndCounty.length; i++) {
      temp.push(region[0].city[0].districtAndCounty[i])
    }
    range.push(temp)
    this.setState({
      range: range
    })
  }

  onChange = (e) => {}
  onColumnChange = (e) => {}

  render () {
    return (
      <View>
        <View className={this.state.region == '请选择省市区'
          ? 'taro-region-picker taro-region-picker-gray'
          : 'taro-region-picker taro-region-picker-black'
        }>
          <Picker
            mode='multiSelector' 
            onChange={this.onChange}
            onColumnChange={this.onColumnChange}
            range={this.state.range}
            value={this.state.value}
          >
            <View style='width: 100%;height:44px;'>
              <Text>{this.state.region}</Text>
            </View>
          </Picker>
        </View>
        <View  disablePrerender>
          <View>
            <Text>No need to be prerender.</Text>
          </View>
        </View>
      </View>
    )
  }
}
