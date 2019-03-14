import React, { Component } from 'react'
import { View, Text, Picker } from '../src'
import Picker2 from '../dist/components/Picker2'

export default class EXPicker extends Component {
  pickerSelectorRange = [ 'Java', 'C++', 'PHP' ]
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
    ],
    pickerSelectorValue: 0
  }

  onSelectorChange = (event) => {
    console.log('Picker::selector onChange', event)
    this.setState({ pickerSelectorValue: event.detail.value })
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
        <Picker2
          data={[
            {
              value: '广东省',
              label: '广东省',
              children: [
                {
                  value: '深圳市',
                  label: '深圳市',
                  children: [
                    { value: '宝安区', label: '宝安区' },
                    { value: '南山区', label: '南山区' }
                  ]
                },
                {
                  value: '广州市',
                  label: '广州市',
                  children: [
                    { value: '白云区', label: '白云区' },
                    { value: '番禺区', label: '番禺区' },
                    { value: '荔湾区', label: '荔湾区' }
                  ]
                }
              ]
            },
            {
              value: '胡建省',
              label: '胡建省',
              children: [
                {
                  value: '莆田市',
                  label: '莆田市'
                }
              ]
            }
          ]}
        >
          <Text>Picker 2</Text>
        </Picker2>

        <Picker
          mode="selector"
          range={this.pickerSelectorRange}
          onChange={this.onSelectorChange}
        >
          <View>
            <Text>Picker&lt;selector&gt;: {this.pickerSelectorRange[this.state.pickerSelectorValue]}</Text>
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
