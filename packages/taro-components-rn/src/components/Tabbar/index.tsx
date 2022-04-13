/**
 * @warn DO NOT USE ME UNTIL ROUTER IS COMPLETE.
 */

import * as React from 'react'
import { TouchableWithoutFeedback, View, Text, Image } from 'react-native'
import styles from './styles'
import { TabbarProps, TabbarState } from './PropsType'

// function fixPagePath (pagePath) {
//   return pagePath.replace(/^\.?\//, '')
// }

class Tabbar extends React.Component<TabbarProps, TabbarState> {
  constructor(props: TabbarProps) {
    super(props)
    const list = props.conf.list
    if (!(list instanceof Array) || list.length < 2 || list.length > 5) {
      throw new Error('tabBar 配置错误')
    }

    // this.homePage = fixPagePath(props.homePage)

    this.state = {
      list,
      isShow: true,
      selectedIndex: 0,
    }
  }

  static defaultProps = {
    homePage: '',
  }

  hideBar(): void {
    this.setState({ isShow: false })
  }

  showBar(): void {
    this.setState({ isShow: true })
  }

  onPress = (index: number, e: Record<string, unknown>): void => {
    this.props.onClick && this.props.onClick(e, index)
  }

  render(): JSX.Element | boolean {
    const {
      conf,
      // router = {}
    } = this.props

    return (
      this.state.isShow && (
        <View
          style={[
            styles.bar,
            {
              borderTopColor: conf.borderStyle || '#F7F7FA',
              backgroundColor: conf.backgroundColor,
            },
          ]}
        >
          {this.state.list.map((item, index) => {
            const isActive = this.state.selectedIndex === index
            const itemActiveStyle = isActive && {
              backgroundColor: '#EAEAEA',
            }
            const textActiveStyle = {
              color: isActive ? conf.selectedColor : conf.color,
            }
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={this.onPress.bind(this, index)}
              >
                <View style={[styles.barItem, itemActiveStyle]}>
                  <Image
                    source={{
                      uri: isActive ? item.selectedIconPath : item.iconPath,
                    }}
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
    )
  }
}

export default Tabbar
