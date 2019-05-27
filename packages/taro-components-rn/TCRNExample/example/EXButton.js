import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, Label, Text, Button } from '../../dist'

export default class EXButton extends Component {
  render () {
    return (
      <View style={styles.wrapper}>
        <Button onClick={() => { alert('Hey, you click me!') }} style={styles.button}>default</Button>
        <Button size="mini" style={styles.button}>default mini</Button>
        <Button
          plain
          style={styles.button}
          hoverStyle={{ backgroundColor: 'red' }}
        >
          default plain
        </Button>
        <Button style={styles.button}><View><Text>wrap View</Text></View></Button>
        <Button style={styles.button}><Text>wrap Text</Text></Button>
        <Button loading style={styles.button}>default loading</Button>
        <Button disabled style={styles.button}>default disabled</Button>
        <Button plain disabled style={styles.button}>default plain disabled</Button>

        <Button type="primary" style={styles.button}>primary</Button>
        <Button type="primary" plain style={styles.button}>primary plain</Button>
        <Button type="primary" disabled style={styles.button}>primary disabled</Button>
        <Button type="primary" plain disabled style={styles.button}>primary plain disabled</Button>

        <Button type="warn" style={styles.button}>warn</Button>
        <Button type="warn" plain style={styles.button}>warn plain</Button>
        <Button type="warn" loading style={styles.button}>warn loading</Button>
        <Button type="warn" disabled style={styles.button}>warn disabled</Button>
        <Button type="warn" plain disabled style={styles.button}>warn plain disabled</Button>

        <Label style={styles.label}>
          <Button onClick={() => { alert('Hey, you click me!') }} style={[styles.button, styles.labelButton]}>with label</Button>
          <Text>标签</Text>
        </Label>

        <Label>
          <View style={styles.label}>
            <Button onClick={() => { alert('Hey, you click me!') }} style={[styles.button, styles.labelButton]}>with label</Button>
            <Text>标签</Text>
          </View>
        </Label>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    margin: 5
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  labelButton: {
    margin: 0,
    marginRight: 5
  }
})
