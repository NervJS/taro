import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import InputDoc from '../../components/input/index.md'
import SliderDoc from '../../components/slider/index.md'
import SwitchDoc from '../../components/switch/index.md'
import RadioDoc from '../../components/radio/index.md'
import CheckboxDoc from '../../components/checkbox/index.md'
import TextareaDoc from '../../components/textarea/index.md'
import PickerDoc from '../../components/picker/index.md'
export default class Form extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      array: ['美国', '中国', '巴西', '日本'],
      objectArray: [
        {
          id: 0,
          name: '阿森纳'
        },
        {
          id: 1,
          name: '切尔西'
        },
        {
          id: 2,
          name: '曼联'
        },
        {
          id: 3,
          name: '曼城'
        },
        {
          id: 4,
          name: '利物浦'
        },
        {
          id: 6,
          name: '热刺'
        }
      ],
      index: 1,
      multiArray: [
        ['无脊柱动物', '脊柱动物'],
        ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
        ['猪肉绦虫', '吸血虫']
      ],
      objectMultiArray: [
        [
          {
            id: 0,
            name: '无脊柱动物'
          },
          {
            id: 1,
            name: '脊柱动物'
          }
        ],
        [
          {
            id: 0,
            name: '扁性动物'
          },
          {
            id: 1,
            name: '线形动物'
          },
          {
            id: 2,
            name: '环节动物'
          },
          {
            id: 3,
            name: '软体动物'
          },
          {
            id: 3,
            name: '节肢动物'
          }
        ],
        [
          {
            id: 0,
            name: '猪肉绦虫'
          },
          {
            id: 1,
            name: '吸血虫'
          }
        ]
      ],
      multiIndex: [0, 0, 0],
      time: '23:59',
      sliderValue: 20,
      date: '2018-4-07',
      checkboxItem: [
        { name: 'USA', value: '美国' },
        { name: 'CHN', value: '中国', checked: true }
      ],
      radioItem: [
        { name: '美国', value: 'USA' },
        { name: '中国', value: 'CHN', checked: true }
      ]
    }

    this.onChange = this.onChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onMultiPickerChange = this.onMultiPickerChange.bind(this)
    this.onMultiPickerColumnChange = this.onMultiPickerColumnChange.bind(this)
    this.onMultiPickerCancel = this.onMultiPickerCancel.bind(this)
    this.onTimePickerChange = this.onTimePickerChange.bind(this)
    this.onTimePickerCancel = this.onTimePickerCancel.bind(this)
    this.onDatePickerChange = this.onDatePickerChange.bind(this)
    this.onDatePickerCancel = this.onDatePickerCancel.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.handleSliderChanging = this.handleSliderChanging.bind(this)
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onChange (e) {
    this.setState({
      index: e.detail.value
    })
  }

  onCancel () {
    console.log('cancel')
  }
  onMultiPickerChange (e) {
    this.setState({
      multiIndex: e.detail.value
    })
  }
  onMultiPickerColumnChange (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    var data = {
      multiArray: this.state.multiArray.slice(0),
      multiIndex: this.state.multiIndex.slice(0)
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [
              '扁性动物',
              '线形动物',
              '环节动物',
              '软体动物',
              '节肢动物'
            ]
            data.multiArray[2] = ['猪肉绦虫', '吸血虫']
            break
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
            data.multiArray[2] = ['鲫鱼', '带鱼']
            break
        }
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫']
                break
              case 1:
                data.multiArray[2] = ['蛔虫']
                break
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥']
                break
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓']
                break
              case 4:
                data.multiArray[2] = [
                  '昆虫',
                  '甲壳动物',
                  '蛛形动物',
                  '多足动物'
                ]
                break
            }
            break
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼']
                break
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼']
                break
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎']
                break
            }
            break
        }
        data.multiIndex[2] = 0
        break
    }
    this.setState(data)
  }

  onMultiPickerCancel () {
    console.log('multipicker cancel')
  }

  onTimePickerChange (e) {
    this.setState({
      time: e.detail.value
    })
  }

  onTimePickerCancel () {
    console.log('timepicker cancel')
  }
  onDatePickerChange (e) {
    this.setState({
      date: e.detail.value.join('-')
    })
  }
  onDatePickerCancel (e) {}

  handleSliderChange (e) {
    console.log(e)
    this.setState({
      sliderValue: e.detail.value
    })
  }
  handleSliderChanging (e) {
    console.log(e)
  }

  handleCheckBoxChange (e) {
    console.log(e.detail.value)
    this.setState({
      checkboxItem: e.detail.value
    })
  }

  handleRadioChange (e) {
    console.log(e.detail.value)
    this.setState({
      radioItem: e.detail.value
    })
  }

  handleSubmit (value) {
    console.log(value)
  }

  render () {
    function handleChange (e) {
      console.log(e)
    }

    return (
      <Taro.View className=''>
        <Taro.View className='page form'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>form</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>表单</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.Form onSubmit={this.handleSubmit} state={this.state}>
            <Taro.View className='page__con'>
              <Taro.View className='page__con__list'>
                <Taro.View className='page__con__title'>
                  <Taro.View>
                    <Taro.Text>switch</Taro.Text>
                  </Taro.View>
                  <Taro.Switch onChange={handleChange} />
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>radio</Taro.Text>
                  <Taro.View>
                    <Taro.RadioGroup
                      name='radio'
                      onChange={this.handleRadioChange}
                    >
                      {this.state.radioItem.map(item => {
                        return (
                          <Taro.Label for={item.name}>
                            <Taro.Radio
                              color='#09bb07'
                              value={item.name}
                              checked={item.checked}
                            >
                              <Taro.Text>{item.value}</Taro.Text>
                            </Taro.Radio>
                          </Taro.Label>
                        )
                      })}
                    </Taro.RadioGroup>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>checkbox</Taro.Text>
                  <Taro.View>
                    <Taro.CheckboxGroup
                      name='checkbox'
                      onChange={this.handleCheckBoxChange}
                    >
                      {this.state.checkboxItem.map(item => {
                        return (
                          <Taro.Label for={item.name}>
                            <Taro.Checkbox
                              color='#09bb07'
                              value={item.name}
                              checked={item.checked}
                            >
                              <Taro.Text>{item.value}</Taro.Text>
                            </Taro.Checkbox>
                          </Taro.Label>
                        )
                      })}
                    </Taro.CheckboxGroup>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>input</Taro.Text>
                  <Taro.View className='weui-cells'>
                    <Taro.View className='weui-cell'>
                      <Taro.Input
                        placeholder='这是一个输入框'
                        type='text'
                        onChange={this.handleChange}
                      />
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>textarea</Taro.Text>
                  <Taro.View className='weui-cells weui-cells_form'>
                    <Taro.View className='weui-cell'>
                      <Taro.Textarea placeholder='请输入文本' rows='4' />
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>slider</Taro.Text>
                  <Taro.View>
                    <Taro.Slider
                      value={this.state.sliderValue}
                      showValue
                      blockSize={16}
                      onChange={this.handleSliderChange}
                      onChanging={this.handleSliderChanging}
                    />
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>普通选择器</Taro.Text>
                  <Taro.View className='weui-cells'>
                    <Taro.View
                      className='weui-cell weui-cell_select'
                      style='padding:15px'
                    >
                      <Taro.Picker
                        className='selector weui-cell__bd'
                        range={this.state.array}
                        value={this.state.index}
                        bindchange={this.onChange}
                        bindcancel={this.onCancel}
                      >
                        <Taro.View className='weui-cell__hd'>
                          当前选择:{this.state.array[this.state.index]}
                        </Taro.View>
                      </Taro.Picker>
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>多列选择器</Taro.Text>
                  <Taro.View className='weui-cells'>
                    <Taro.View
                      className='weui-cell weui-cell_select'
                      style='padding:15px'
                    >
                      <Taro.Picker
                        className='selector weui-cell__bd'
                        mode='multiSelector'
                        range={this.state.multiArray}
                        value={this.state.multiIndex}
                        bindchange={this.onMultiPickerChange}
                        bindcolumnchange={this.onMultiPickerColumnChange}
                        bindcancel={this.onMultiPickerCancel}
                      >
                        <Taro.View className='weui-cell__hd'>
                          当前选择:
                          {
                            this.state.multiArray[0][this.state.multiIndex[0]]
                          }，{
                            this.state.multiArray[1][this.state.multiIndex[1]]
                          }，{
                            this.state.multiArray[2][this.state.multiIndex[2]]
                          }
                        </Taro.View>
                      </Taro.Picker>
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>时间选择器</Taro.Text>
                  <Taro.View className='weui-cells'>
                    <Taro.View
                      className='weui-cell weui-cell_select'
                      style='padding:15px'
                    >
                      <Taro.Picker
                        className='selector weui-cell__bd'
                        mode='time'
                        value={this.state.time}
                        start='09:01'
                        end='21:01'
                        bindchange={this.onTimePickerChange}
                        bindcancel={this.onTimePickerCancel}
                      >
                        <Taro.View className='weui-cell__hd'>
                          当前选择:
                          {this.state.time}
                        </Taro.View>
                      </Taro.Picker>
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>日期选择器</Taro.Text>
                  <Taro.View className='weui-cells'>
                    <Taro.View
                      className='weui-cell weui-cell_select'
                      style='padding:15px'
                    >
                      <Taro.Picker
                        className='selector weui-cell__bd'
                        mode='date'
                        value={this.state.date}
                        start='2000-02-21'
                        end='2019-01-01'
                        bindchange={this.onDatePickerChange}
                        bindcancel={this.onDatePickerCancel}
                      >
                        <Taro.View className='weui-cell__hd'>
                          当前选择:
                          {this.state.date}
                        </Taro.View>
                      </Taro.Picker>
                    </Taro.View>
                  </Taro.View>
                </Taro.View>
                <Taro.View className='page__con__title'>
                  <Taro.Text>Button</Taro.Text>
                  <Taro.View className='weui-btn-area'>
                    <Taro.Button
                      className='weui-btn weui-btn_primary'
                      // disabled='true'
                      hoverClass='red'
                    >
                      测试
                    </Taro.Button>
                  </Taro.View>
                </Taro.View>
              </Taro.View>
            </Taro.View>
          </Taro.Form>
        </Taro.View>
        <Taro.View className='markdown'>
          <SwitchDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <RadioDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <CheckboxDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <InputDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <TextareaDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <SliderDoc />
        </Taro.View>
        <Taro.View className='markdown'>
          <PickerDoc />
        </Taro.View>
      </Taro.View>
    )
  }
}
