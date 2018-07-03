import React, { Component } from 'react'
import { View, Text, Picker } from '../src'

export default class EXPicker extends Component {
  state = {
    pickerRange: [
      [
        { id: 0, name: 'Java' },
        { id: 1, name: 'C++' },
        { id: 2, name: 'PHP' },
      ],
      [
        { id: 0, name: '一級' },
        { id: 1, name: '二級' },
        { id: 2, name: '三級' },
      ]
    ]
  }

  onSelectorChange = (event) => {
    console.log('Picker::selector onChange', event)
  }

  onMultiSelectorCancel = () => {
    console.log('Picker::multiSelector onCancel')
  }

  onMultiSelectorChange = (event) => {
    console.log('Picker::multiSelector onChange', event)
  }

  onMultiSelectorColumnChange = (event) => {
    console.log('Picker::1 onColumnChange', event)
    if (event.detail.column === 0) {
      if (event.detail.value.name === 'C++') {
        this.state.pickerRange[1] = [
          { id: 3, name: '四級' },
          { id: 4, name: '五級' },
          { id: 5, name: '六級' },
        ]
      } else {
        this.state.pickerRange[1] = [
          { id: 0, name: '一級' },
          { id: 1, name: '二級' },
          { id: 2, name: '三級' },
        ]
      }
      this.setState({
        pickerRange: [...this.state.pickerRange]
      })
    }
  }

  render () {
    return (
      <View>
        <Picker
          mode="selector"
          range={[
            'Java',
            'C++',
            'PHP'
          ]}
          onChange={this.onSelectorChange}
        >
          <View>
            <Text>Picker&lt;selector&gt;</Text>
          </View>
        </Picker>

        <Picker
          mode="multiSelector"
          range={this.state.pickerRange}
          rangeKey="name"
          onCancel={this.onMultiSelectorCancel}
          onChange={this.onMultiSelectorChange}
          onColumnChange={this.onMultiSelectorColumnChange}
        >
          <View>
            <Text>Picker&lt;multiSelector&gt;</Text>
          </View>
        </Picker>
        <Picker
          // disabled={true}
          // mode="date"
          // value="2018-11-11"
          // start="2018-12-12"
          // end="2018-12-12"
          mode="time"
          value="12:00"
          start="11:11"
          end="20:00"
          onChange={(event) => {
            console.log(event)
          }}
        />
        <Picker
          mode="region"
          customItem="不限"
          onChange={(event) => {
            console.log('Picker::region onChange', event)
          }}
        >
          <View><Text>Picker&lt;region&gt;</Text></View>
        </Picker>
        <Picker
          mode="date"
          onChange={(event) => {
            console.log('Picker::date onChange', event)
          }}
        >
          <View><Text>Picker&lt;date&gt;</Text></View>
        </Picker>
      </View>
    )
  }
}
