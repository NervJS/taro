import { Image, Text, View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import classNames from 'classnames'
import _chunk from 'lodash/chunk'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

import { mergeStyle } from '../../common/utils'
import { AtGridItem, AtGridProps } from '../../types/grid'

export default class AtGrid extends React.Component<AtGridProps> {
  public static defaultProps: AtGridProps
  public static propTypes: InferProps<AtGridProps>

  private handleClick = (
    item: AtGridItem,
    index: number,
    row: number,
    event: CommonEvent
  ): void => {
    const { onClick, columnNum = 3 } = this.props
    if (typeof onClick === 'function') {
      const clickIndex = row * columnNum + index
      onClick(item, clickIndex, event)
    }
  }

  public render (): JSX.Element | null {
    const { data, mode, columnNum = 3, hasBorder } = this.props

    if (Array.isArray(data) && data.length === 0) {
      return null
    }

    const gridGroup = _chunk(data, columnNum)

    const bodyClass = classNames(
      ['at-grid__flex-item', 'at-grid-item', `at-grid-item--${mode}`],
      {
        'at-grid-item--no-border': !hasBorder
      }
    )

    return (
      <View className={classNames('at-grid', this.props.className)}>
        {gridGroup.map((item, i) => (
          <View className='at-grid__flex' key={`at-grid-group-${i}`}>
            {item.map((childItem, index) => (
              <View
                key={`at-grid-item-${index}`}
                className={classNames(bodyClass, {
                  'at-grid-item--last': index === columnNum - 1
                })}
                onClick={this.handleClick.bind(this, childItem, index, i)}
                style={{
                  flex: `0 0 ${100 / columnNum}%`
                }}
              >
                <View className='at-grid-item__content'>
                  <View className='at-grid-item__content-inner'>
                    <View className='content-inner__icon'>
                      {childItem.image && (
                        <Image
                          className='content-inner__img'
                          src={childItem.image}
                          mode='scaleToFill'
                        />
                      )}
                      {childItem.iconInfo && !childItem.image && (
                        <Text
                          className={classNames(
                            childItem.iconInfo.prefixClass || 'at-icon',
                            {
                              [`${
                                childItem.iconInfo.prefixClass || 'at-icon'
                              }-${childItem.iconInfo.value}`]: childItem
                                .iconInfo.value
                            },
                            childItem.iconInfo.className
                          )}
                          style={mergeStyle(
                            {
                              color: childItem.iconInfo.color,
                              fontSize: `${childItem.iconInfo.size || 24}px`
                            },
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            childItem.iconInfo!.customStyle!
                          )}
                        />
                      )}
                    </View>
                    <Text className='content-inner__text'>
                      {childItem.value}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }
}

AtGrid.defaultProps = {
  data: [],
  columnNum: 3,
  mode: 'square',
  hasBorder: true
}

AtGrid.propTypes = {
  mode: PropTypes.string,
  onClick: PropTypes.func,
  hasBorder: PropTypes.bool,
  columnNum: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      value: PropTypes.string,
      iconInfo: PropTypes.shape({
        size: PropTypes.number,
        value: PropTypes.string,
        color: PropTypes.string,
        prefixClass: PropTypes.string,
        customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        className: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
      })
    })
  )
}
