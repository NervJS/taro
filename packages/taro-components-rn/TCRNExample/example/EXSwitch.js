import React, { Component } from 'react'
import { View, Text, Label, Switch } from '../../dist'

export default class EXSwitch extends Component {
  state = {
    isSwitchChecked: true,
    isSwitchChecked2: false
  }

  onSwitchChange = (isChecked) => {
  }

  render () {
    return (
      <View>
        <Switch
          checked={this.state.isSwitchChecked}
          onChange={this.onSwitchChange}
        />
        <Switch
          type="checkbox"
          checked={this.state.isSwitchChecked2}
        />
        <Text>--- with label ---</Text>
        <Label style={{ flexDirection: 'row' }}>
          <Switch
            checked={this.state.isSwitchChecked}
            onChange={this.onSwitchChange}
          />
          <Text>点我点我</Text>
        </Label>
        <Label style={{ flexDirection: 'row' }}>
          <Switch
            type="checkbox"
            checked={this.state.isSwitchChecked2}
          />
          <Text>点我点我</Text>
        </Label>
        <Label>
          <View style={{ flexDirection: 'row' }}>
            <Switch
              checked={this.state.isSwitchChecked}
              onChange={this.onSwitchChange}
            />
            <Text>点我点我2</Text>
          </View>
        </Label>
        <Label>
          <View style={{ flexDirection: 'row' }}>
            <Switch
              type="checkbox"
              checked={this.state.isSwitchChecked2}
            />
            <Text>点我点我2</Text>
          </View>
        </Label>
      </View>
    )
  }
}
