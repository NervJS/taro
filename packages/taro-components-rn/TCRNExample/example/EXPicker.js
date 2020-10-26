import React, { Component } from 'react'
import { View, Text, Picker } from '../../dist'

export default class EXPicker extends Component {
  state = {
    selectorValue: 1,
    selectorRange: [
      { id: 0, name: 'Java' },
      { id: 1, name: 'C++' },
      { id: 2, name: 'PHP' },
    ],
    selectorValue2: 1,
    selectorRange2: ['北京', '上海', '天津', '重庆'],
    multiSelectorValue: [0, 1],
    multiSelectorRange: [
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
    timeSelectorValue: '12:30',
    dateSelectorValue: '2019-3-3',
    regionSelectorValue: ['广东省', '深圳市', '宝安区']
  }

  render () {
    return (
      <View>
        <Picker
          range={this.state.selectorRange}
          rangeKey="name"
          value={this.state.selectorValue}
          onChange={(event) => {
            this.setState({ selectorValue: event.detail.value })
            console.log('onChange', event)
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:selector - VALUE:{this.state.selectorValue}</Text>
        </Picker>

        <Picker
          range={this.state.selectorRange2}
          value={this.state.selectorValue2}
          onChange={(event) => {
            this.setState({ selectorValue2: event.detail.value })
            console.log('onChange', event)
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:selector2 - VALUE:{this.state.selectorValue2}</Text>
        </Picker>

        <Picker
          mode='multiSelector'
          range={this.state.multiSelectorRange}
          rangeKey="name"
          value={this.state.multiSelectorValue}
          onChange={(event) => {
            this.setState({ multiSelectorValue: event.detail.value })
            console.log('onChange', event)
          }}
          onColumnChange={(event) => {
            console.log('onColumnChange', event)
            // const col = event.detail.column
            // const row = event.detail.value
            // if (col === 0) {
            //   this.state.multiSelectorRange[1] = row === 1 ? [
            //     { id: 0, name: 'A级' },
            //     { id: 1, name: 'B级' },
            //     { id: 2, name: 'C级' }
            //   ] : [
            //     { id: 0, name: '一級' },
            //     { id: 1, name: '二級' },
            //     { id: 2, name: '三級' },
            //   ]
            //   this.setState({
            //     multiSelectorRange: [...this.state.multiSelectorRange]
            //   })
            // }
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:multiSelector - VALUE:{this.state.multiSelectorValue}</Text>
        </Picker>

        <Picker
          mode="time"
          value={this.state.timeSelectorValue}
          start="10:00"
          end="18:00"
          onChange={(event) => {
            this.setState({ timeSelectorValue: event.detail.value })
            console.log('onChange', event)
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:time - VALUE:{this.state.timeSelectorValue}</Text>
        </Picker>

        <Picker
          mode="date"
          value={this.state.dateSelectorValue}
          start="2018-6-18"
          end="2019-11-11"
          fields="month"
          onChange={(event) => {
            this.setState({ dateSelectorValue: event.detail.value })
            console.log('onChange', event)
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:date - VALUE:{this.state.dateSelectorValue}</Text>
        </Picker>

        <Picker
          mode="region"
          value={this.state.regionSelectorValue}
          customItem="不限"
          onChange={(event) => {
            this.setState({ regionSelectorValue: event.detail.value })
            console.log('onChange', event)
          }}
          onCancel={() => console.log('onCancel')}
          // disabled
        >
          <Text>Picker:region - VALUE:{this.state.regionSelectorValue}</Text>
        </Picker>
      </View>
    )
  }
}
