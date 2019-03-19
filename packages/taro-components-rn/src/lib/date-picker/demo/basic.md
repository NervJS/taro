---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

[Demo Source Code](https://github.com/ant-design/ant-design-mobile-rn/blob/master/components/date-picker/demo/basic.tsx)

```jsx
import React from 'react';
import { View } from 'react-native';
import { DatePicker, List } from '@ant-design/react-native';
// const now = new Date();
export default class PopupExample extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = value => {
      this.setState({ value });
    };
    this.state = {
      value: undefined,
    };
  }
  render() {
    return (
      <View>
        <List>
          <DatePicker
            value={this.state.value}
            mode="date"
            minDate={new Date(2015, 7, 6)}
            maxDate={new Date(2026, 11, 3)}
            onChange={this.onChange}
            format="YYYY-MM-DD"
          >
            <List.Item arrow="horizontal">Select Date</List.Item>
          </DatePicker>
        </List>
      </View>
    );
  }
}
```
