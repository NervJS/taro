import React, { Component } from 'react'
import { View, Text, Label, Radio, RadioGroup } from '../src'

export default class EXRadio extends Component {
  onGroupChange = (event) => {
    console.log(event)
  }

  render () {
    return (
      <View>
        <Radio />
        <RadioGroup
          style={{ flexDirection: 'row' }}
          onChange={this.onGroupChange}
        >
          <Radio value="0" />
          <Radio value="1" />
          <Radio value="2" />
        </RadioGroup>
        <Text>---- with label ---</Text>
        <Label style={{ flexDirection: 'row' }}><Radio /><Text>点我点我</Text></Label>
        <RadioGroup style={{ flexDirection: 'row' }}>
          <Label style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row' }}>
              <Radio value="0" /><Text>点我点我</Text>
            </View>
          </Label>
          <Label style={{ flexDirection: 'row' }}>
            <Radio value="1" /><Text>点我点我</Text>
          </Label>
          <Label style={{ flexDirection: 'row' }}>
            <Radio value="2" /><Text>点我点我</Text>
          </Label>
        </RadioGroup>
      </View>
    )
  }
}
