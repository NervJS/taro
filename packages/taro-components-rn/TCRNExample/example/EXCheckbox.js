import React, { Component } from 'react'
import { View, Text, Label, Checkbox, CheckboxGroup } from '../../dist'

export default class EXCheckbox extends Component {
  state = {
    isCheckboxChecked: false
  }

  onCheckboxChange = (item) => {
    this.setState({
      isCheckboxChecked: !!item.checked
    })
  }

  onCheckboxGroupChange = (detail) => {
    // { value: [] }
    console.log(detail)
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ isCheckboxChecked: true })
    }, 3000)
  }

  render () {
    return (
      <View>
        <Checkbox
          checked={this.state.isCheckboxChecked}
          onChange={this.onCheckboxChange}
        />
        <CheckboxGroup
          onChange={this.onCheckboxGroupChange}
          style={{ flexDirection: 'row' }}
        >
          <Checkbox value={0} />
          <Checkbox value={1} />
          <Checkbox value={2} />
        </CheckboxGroup>
        <Text>---- with label ---</Text>
        <Label style={{ flexDirection: 'row' }}>
          <Checkbox
            checked={this.state.isCheckboxChecked}
            onChange={this.onCheckboxChange}
          />
          <Text>点我点我</Text>
        </Label>
        <CheckboxGroup
          onChange={this.onCheckboxGroupChange}
          style={{ flexDirection: 'row' }}
        >
          <Label style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox value={0} /><Text>点我点我</Text>
            </View>
          </Label>
          <Label style={{ flexDirection: 'row' }}>
            <Checkbox value={1} /><Text>点我点我</Text>
          </Label>
          <Label style={{ flexDirection: 'row' }}>
            <Checkbox value={2} /><Text>点我点我</Text>
          </Label>
        </CheckboxGroup>
      </View>
    )
  }
}
