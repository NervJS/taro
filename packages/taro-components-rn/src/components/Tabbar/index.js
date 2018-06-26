/**
 * @warn DO NOT USE ME UNTIL ROUTER IS COMPLETE.
 *
 * @flow
 */

import * as React from 'react'
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
} from 'react-native'
import styles from './styles'

// function fixPagePath (pagePath) {
//   return pagePath.replace(/^\.?\//, '')
// }

type Props = {
  conf: {
    list: Array<any>,
    borderStyle?: 'black' | 'white',
    backgroundColor?: string,
    selectedColor?: string,
    color?: string
  },
  homePage: string,
}

type State = {
  list: Array<any>,
  isShow: boolean,
  selectedIndex: number
}

class Tabbar extends React.Component<Props, State> {
  constructor (props: Props) {
    super(...arguments)
    const list = props.conf.list
    if (
      !(list instanceof Array) ||
      list.length < 2 ||
      list.length > 5
    ) {
      throw new Error('tabBar 配置错误')
    }

    // this.homePage = fixPagePath(props.homePage)

    this.state = {
      list,
      isShow: false,
      selectedIndex: 0
    }
  }

  static defaultProps = {
    homePage: ''
  }

  hideBar () {
    this.setState({ isShow: false })
  }

  showBar () {
    this.setState({ isShow: true })
  }

  onPress = (index: number) => {
  }

  render () {
    const {
      conf,
      // router = {}
    } = this.props

    return this.state.isShow && (
      <View
        style={[
          styles.bar, {
            borderTopColor: conf.borderStyle || '#F7F7FA',
            backgroundColor: conf.backgroundColor
          }
        ]}
      >
        {this.state.list.map((item, index) => {
          const isActive = this.state.selectedIndex === index
          const itemActiveStyle = isActive && {
            backgroundColor: '#EAEAEA'
          }
          const textActiveStyle = {
            color: isActive ? conf.selectedColor : conf.color
          }
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={this.onPress.bind(this, index)}
            >
              <View style={[styles.barItem, itemActiveStyle]}>
                <Image
                  source={{ uri: isActive ? item.selectedIconPath : item.iconPath }}
                  style={styles.barItemIcon}
                />
                <Text style={[styles.barItemLabel, textActiveStyle]}>
                  {item.text}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    )
  }
}

export default Tabbar
