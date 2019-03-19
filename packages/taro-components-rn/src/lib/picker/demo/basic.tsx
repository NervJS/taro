import { district } from 'antd-mobile-demo-data';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { List, Picker } from '../../';
const data = require('./data.json')
const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={props.onPress}>
    <View
      style={{ height: 36, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}
    >
      <Text style={{ flex: 1 }}>{props.children}</Text>
      <Text style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</Text>
    </View>
  </TouchableOpacity>
);

export default class PopupExample extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      value: [],
      pickerValue: [],
    };
  }
  onPress = () => {
    setTimeout(() => {
      this.setState({
        data: district,
      });
    }, 500);
  }
  onChange = (value: any) => {
    this.setState({ value });
  }
  render() {

    return (
      <View style={{ marginTop: 30 }}>
        <List>
          <Picker
            data={data}
            cols={3}
            value={this.state.value}
            onChange={this.onChange}
          >
            <List.Item arrow="horizontal" onPress={this.onPress}>
              省市选择
            </List.Item>
          </Picker>
          <Picker
            data={this.state.data}
            cols={2}
            value={this.state.value}
            onChange={this.onChange}
          >
            <List.Item arrow="horizontal" onPress={this.onPress}>
              省市选择(异步加载)
            </List.Item>
          </Picker>
          <Picker
            title="选择地区"
            data={district}
            cols={2}
            value={this.state.pickerValue}
            onChange={(v: any) => this.setState({ pickerValue: v })}
            onOk={(v: any) => this.setState({ pickerValue: v })}
          >
            <CustomChildren>Customized children</CustomChildren>
          </Picker>
        </List>
      </View>
    );
  }
}
