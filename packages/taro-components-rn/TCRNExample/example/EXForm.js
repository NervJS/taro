import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  Switch,
  Slider,
  Input,
  Textarea,
  Label,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Picker,
  Form
} from '../../dist'

export default class EXForm extends Component {
  state = {
    progressPercent: 70
  }

  onSubmit = (event) => {
    console.log(event)
  }

  render () {
    return (
      <View>
        <Form onSubmit={this.onSubmit}>
          <Label style={{ flexDirection: 'row' }}>
            <Switch name="iamswitch" checked={true} />
          </Label>
          <Slider
            value={this.state.progressPercent}
            showValue={true}
            name="iamslider"
            style={{ width: 300 }}
          />
          <Input value="default input value" name="iaminput" />
          <Textarea
            value="default textarea value"
            style={{ width: 300, height: 30 }}
            name="iamtextarea"
          />
          <CheckboxGroup style={{ flexDirection: 'row' }} name="iamcheckboxgroup">
            <Label style={{ flexDirection: 'row' }}><Checkbox value={0} /></Label>
            <Label style={{ flexDirection: 'row' }}><Checkbox value={1} /></Label>
            <Label style={{ flexDirection: 'row' }}><Checkbox value={2} /></Label>
          </CheckboxGroup>
          <RadioGroup style={{ flexDirection: 'row' }} name="iamradiogroup">
            <Label style={{ flexDirection: 'row' }}><Radio value="0" checked /></Label>
            <Label style={{ flexDirection: 'row' }}><Radio value="1" /></Label>
            <Label style={{ flexDirection: 'row' }}><Radio value="2" /></Label>
          </RadioGroup>
          <Picker
            mode="multiSelector"
            value={[0, 2]}
            range={[
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
            ]}
            rangeKey="name"
            name="iampickermultiselector"
          >
            <Text>Picker&lt;multiSelector&gt;</Text>
          </Picker>
          <Button formType="submit">提交</Button>
        </Form>
      </View>
    )
  }
}
