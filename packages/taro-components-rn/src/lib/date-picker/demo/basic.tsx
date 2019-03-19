
/* tslint:disable:no-console */
import React from 'react';
import { View } from 'react-native';
import { DatePicker, List } from '../../';

// const now = new Date();

export default class PopupExample extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  onChange = (value: any) => {
    this.setState({ value });
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
