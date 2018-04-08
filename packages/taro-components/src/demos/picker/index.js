import Nerv from 'nervjs'
import { Picker, View } from '../../components'

export default class PickerDemo extends Nerv.Component {
  constructor (props) {
    super(props)

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
      multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
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
        ], [
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
        ], [
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
      time: '23:59'
    }

    this.onChange = this.onChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onMultiPickerChange = this.onMultiPickerChange.bind(this)
    this.onMultiPickerColumnChange = this.onMultiPickerColumnChange.bind(this)
    this.onMultiPickerCancel = this.onMultiPickerCancel.bind(this)
    this.onTimePickerChange = this.onTimePickerChange.bind(this)
    this.onTimePickerCancel = this.onTimePickerCancel.bind(this)
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
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
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
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
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

  render () {
    return (
      <View>
        <View>普通选择器</View>
        <Picker
          className='selector'
          range={this.state.array}
          value={this.state.index}
          bindchange={this.onChange}
          bindcancel={this.onCancel} >
          <View>当前选择: {this.state.array[this.state.index]}</View>
        </Picker>

        <View>多列选择器</View>
        <Picker
          className='selector'
          mode='multiSelector'
          range={this.state.multiArray}
          value={this.state.multiIndex}
          bindchange={this.onMultiPickerChange}
          bindcolumnchange={this.onMultiPickerColumnChange}
          bindcancel={this.onMultiPickerCancel} >
          <View>当前选择: {this.state.multiArray[0][this.state.multiIndex[0]]}，{this.state.multiArray[1][this.state.multiIndex[1]]}，{this.state.multiArray[2][this.state.multiIndex[2]]}</View>
        </Picker>
        <View>时间选择器</View>
        <Picker
          className='selector'
          mode='time'
          value={this.state.time}
          start='09:01'
          end='21:01'
          bindchange={this.onTimePickerChange}
          bindcancel={this.onTimePickerCancel}
        >
          <View>当前选择：{this.state.time}</View>
        </Picker>
      </View>
    )
  }
}
