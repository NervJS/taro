import Nerv from 'nervjs'
import { TOP, LINE_HEIGHT, MASK_HEIGHT } from '../constant'

export default class PickerGroup extends Nerv.Component {
  constructor (props) {
    super(props)
  }

  getPosition (id) {
    const transition = this.touchEnd ? 0.3 : 0
    return `transform: translate3d(0, ${
      this.props.height
    }px, 0);-webkit-transform: translate3d(0, ${
      this.props.height
    }px, 0);transition: transform ${transition}s;-webkit-transition: transform ${transition}s;`
  }

  formulaUnlimitedScroll (range, absoluteHeight, direction) {
    const { height, updateHeight, columnId } = this.props
    const factor = direction === 'up' ? 1 : -1

    this.touchEnd = false

    // 点击超过范围，点击到补帧时，先跳到另一端的补帧
    updateHeight(-range * factor * LINE_HEIGHT + height, columnId)

    // 再做过渡动画
    setTimeout(() => {
      this.touchEnd = true
      const index = Math.round(absoluteHeight / -LINE_HEIGHT) + range * factor
      const relativeHeight = TOP - LINE_HEIGHT * index
      updateHeight(relativeHeight, columnId, true)
    }, 0)
  }

  render () {
    const onTouchStart = e => {
      // 记录第一次的点击位置
      this.startY = e.changedTouches[0].clientY
      this.preY = e.changedTouches[0].clientY
      this.hadMove = false
    }

    const onTouchMove = e => {
      const y = e.changedTouches[0].clientY
      const deltaY = y - this.preY
      this.preY = y
      this.touchEnd = false
      if (Math.abs(y - this.startY) > 10) this.hadMove = true

      let newPos = this.props.height + deltaY

      // 处理时间选择器的无限滚动
      if (this.props.mode === 'time') {
        if (this.props.columnId === '0') {
          // 数字 28 来自于 4 格补帧 + 0 ～ 23 的 24 格，共 28 格
          if (newPos > TOP - LINE_HEIGHT * 3) {
            newPos = TOP - LINE_HEIGHT * 27 + deltaY
          }
          if (newPos < TOP - LINE_HEIGHT * 28) {
            newPos = TOP - LINE_HEIGHT * 4 + deltaY
          }
        } else if (this.props.columnId === '1') {
          if (newPos > TOP - LINE_HEIGHT * 3) {
            newPos = TOP - LINE_HEIGHT * 63 + deltaY
          }
          if (newPos < TOP - LINE_HEIGHT * 64) {
            newPos = TOP - LINE_HEIGHT * 4 + deltaY
          }
        }
      }

      this.props.updateHeight(newPos, this.props.columnId)

      e.preventDefault()
    }

    const onTouchEnd = e => {
      const {
        mode,
        range,
        height,
        updateHeight,
        onColumnChange,
        columnId
      } = this.props
      const max = 0
      const min = -LINE_HEIGHT * (range.length - 1)
      const endY = e.changedTouches[0].clientY

      this.touchEnd = true

      // touchEnd 时的高度，可能带小数点，需要再处理
      let absoluteHeight

      if (!this.hadMove) {
        /** 点击 */
        // 屏幕高度
        const windowHeight = window.innerHeight
        // picker__mask 垂直方向距离屏幕顶部的高度
        const relativeY = windowHeight - MASK_HEIGHT / 2

        absoluteHeight = height - TOP - (endY - relativeY)

        // 处理时间选择器的无限滚动
        if (this.props.mode === 'time') {
          if (this.props.columnId === '0') {
            // 点击上溢出
            // absoluteHeight 是相对模块中点来算的，所以会算多半行，这时要减去这半行，即2.5行
            if (absoluteHeight > -LINE_HEIGHT * 2.5) {
              this.formulaUnlimitedScroll(24, absoluteHeight, 'up')
              return
            }
            // 点击下溢出
            if (absoluteHeight < -LINE_HEIGHT * 28.5) {
              this.formulaUnlimitedScroll(24, absoluteHeight, 'down')
              return
            }
          } else if (this.props.columnId === '1') {
            // 点击上溢出
            if (absoluteHeight > -LINE_HEIGHT * 2.5) {
              this.formulaUnlimitedScroll(60, absoluteHeight, 'up')
              return
            }
            // 点击下溢出
            if (absoluteHeight < -LINE_HEIGHT * 64.5) {
              this.formulaUnlimitedScroll(60, absoluteHeight, 'down')
              return
            }
          }
        }
      } else {
        /** 滚动 */
        absoluteHeight = height - TOP
      }

      // 边界情况处理
      if (absoluteHeight > max) absoluteHeight = 0
      if (absoluteHeight < min) absoluteHeight = min

      // 先按公式算出 index, 再用此 index 算出一个整数高度
      const index = Math.round(absoluteHeight / -LINE_HEIGHT)
      const relativeHeight = TOP - LINE_HEIGHT * index

      if (this.props.mode === 'date') {
        if (this.props.columnId === '0') {
          this.props.updateDay(
            +this.props.range[index].replace(/[^0-9]/gi, ''),
            0
          )
        }
        if (this.props.columnId === '1') {
          this.props.updateDay(
            +this.props.range[index].replace(/[^0-9]/gi, ''),
            1
          )
        }
        if (this.props.columnId === '2') {
          this.props.updateDay(
            +this.props.range[index].replace(/[^0-9]/gi, ''),
            2
          )
        }
      }

      updateHeight(relativeHeight, columnId, mode === 'time')
      onColumnChange && onColumnChange(relativeHeight, columnId, e)
    }

    // picker__item
    const range = this.props.range || []
    const pickerItem = range.map(item => {
      const { rangeKey } = this.props
      const content = rangeKey ? item[rangeKey] : item
      return <div className='weui-picker__item'>{`${content}`}</div>
    })

    return (
      <div
        className='weui-picker__group'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className='weui-picker__mask' />
        <div className='weui-picker__indicator' />
        <div className='weui-picker__content' style={this.getPosition()}>
          {pickerItem}
        </div>
      </div>
    )
  }
}
