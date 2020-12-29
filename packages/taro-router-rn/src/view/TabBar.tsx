// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import {
  Link
} from '@react-navigation/native'
import { withSafeAreaInsets } from 'react-native-safe-area-context'
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  LayoutChangeEvent,
  Keyboard
} from 'react-native'
import { getTabVisible, getTabConfig, getTabItemConfig, getDefalutTabItem, isUrl } from '../utils/index'
import { getInitSafeAreaInsets } from './tabBarUtils'
import TabBarItem, { TabBarOptions, TabOptions } from './TabBarItem'

interface TabBarProps extends TabBarOptions {
  state: Record<string, any>,
  navigation: any,
  descriptors: Record<string, any>,
  userOptions: TabOptions
}

interface TabBarState {
  visible: Animated.Value,
  isKeyboardShown: boolean,
  tabVisible: boolean,
  layout: {
    height: number,
    width: number,
  },
  insets: Record<string, number>
}
interface TabBarStyle {
  color?: string,
  selectedColor?: string,
  backgroundColor?: string,
  borderStyle?: string
}

const DEFAULT_TABBAR_HEIGHT = 55
const COMPACT_TABBAR_HEIGHT = 32
// const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

const useNativeDriver = Platform.OS !== 'web'

export class TabBar extends React.PureComponent<TabBarProps, TabBarState> {
  constructor (props: TabBarProps) {
    super(props)
    const { height = 0, width = 0 } = Dimensions.get('window')
    const { safeAreaInsets, userOptions = {} } = this.props
    const { tabBarVisible = true } = userOptions
    const tabVisible = tabBarVisible === false ? false : getTabVisible()
    this.state = {
      visible: new Animated.Value(tabVisible ? 1 : 0),
      tabVisible: tabVisible,
      isKeyboardShown: false,
      layout: {
        width,
        height
      },
      insets: safeAreaInsets || getInitSafeAreaInsets()
    }
  }

  componentDidMount () {
    const { keyboardHidesTabBar = false } = this.props
    if (keyboardHidesTabBar) {
      if (Platform.OS === 'ios') {
        Keyboard.addListener('keyboardWillShow', () => this.handleKeyboardShow())
        Keyboard.addListener('keyboardWillHide', () => this.handleKeyboardHide())
      } else {
        Keyboard.addListener('keyboardDidShow', () => this.handleKeyboardShow())
        Keyboard.addListener('keyboardDidHide', () => this.handleKeyboardHide())
      }
    }
  }

  componentWillUnmount () {
    const { keyboardHidesTabBar = false } = this.props
    if (keyboardHidesTabBar) {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', () => this.handleKeyboardShow())
        Keyboard.removeListener('keyboardWillHide', () => this.handleKeyboardHide())
      } else {
        Keyboard.removeListener('keyboardDidShow', () => this.handleKeyboardShow())
        Keyboard.removeListener('keyboardDidHide', () => this.handleKeyboardHide())
      }
    }
  }

  UNSAFE_componentWillReceiveProps (): void {
    const curVisible = getTabVisible()
    const { tabVisible } = this.state
    if (curVisible !== tabVisible) {
      this.setState({
        tabVisible: curVisible
      })
      this.setTabBarHidden(curVisible)
    }
  }

  handleKeyboardShow () {
    this.setState({
      isKeyboardShown: true,
      tabVisible: false
    })
    this.setTabBarHidden(true)
  }

  handleKeyboardHide () {
    this.setState({
      isKeyboardShown: false,
      tabVisible: getTabVisible()
    })
    this.setTabBarHidden(false)
  }

  setTabBarHidden (isHidden: boolean) {
    if (!getTabConfig('needAnimate')) return
    const { visible } = this.state
    if (isHidden) {
      this.setState({
        tabVisible: false
      })
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver
      }).start()
    } else {
      Animated.timing(visible, {
        toValue: 1,
        duration: 250,
        useNativeDriver
      }).start(({ finished }) => {
        if (finished) {
          this.setState({
            tabVisible: true
          })
        }
      })
    }
  }

  isLandscape (): boolean {
    const { height = 0, width = 0 } = Dimensions.get('window')
    return width > height
  }

  getDefaultTabBarHeight (): number {
    if (Platform.OS === 'ios' &&
      !Platform.isPad && this.isLandscape()) {
      return COMPACT_TABBAR_HEIGHT
    }
    return DEFAULT_TABBAR_HEIGHT
  }

  // 只有最简单的格式
  buildLink (name: string, params: Record<string, any>): string {
    const keys = Object.keys(params).sort()
    let str = ''
    keys.forEach((v) => {
      str += (v + '=' + encodeURIComponent(params[v]) + '&')
    })
    str = str.slice(0, str.length - 1)
    return str ? `${name}?${str}` : `${name}`
  }

  handleLayout (e: LayoutChangeEvent): void {
    const { layout } = this.state
    const { height, width } = e.nativeEvent.layout
    if (layout.height !== height && layout.width !== width) {
      this.setState({
        layout: {
          width,
          height
        }
      })
    }
  }

  getTabBarStyle (): Record<string, string> {
    const { activeTintColor, inactiveTintColor, style = {} } = this.props
    const tabStyle = getTabConfig('tabStyle') as TabBarStyle
    const { color = '', selectedColor = '', backgroundColor = '', borderStyle = '' } = tabStyle
    const defaultBackground: any = style?.backgroundColor || 'rgb(255, 255, 255)'
    const defalutBorderTopColor:any= style?.borderTopColor || 'rgb(216, 216, 216)'
    return {
      backgroundColor: backgroundColor || defaultBackground,
      borderTopColor: borderStyle || defalutBorderTopColor,
      color: color || inactiveTintColor,
      selectedColor: selectedColor || activeTintColor
    }
  }

  getTabIconSource (index: number, focused: boolean) {
    const item: any = getDefalutTabItem(index)
    const iconPath = getTabItemConfig(index, 'iconPath') ?? item?.iconPath
    const selectedIconPath = getTabItemConfig(index, 'selectedIconPath') ?? item?.selectedIconPath
    const path = focused ? selectedIconPath : iconPath

    return isUrl(path) ? { uri: path } : { uri: path }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  renderContent () {
    const { state, descriptors, navigation } = this.props
    const horizontal = true
    const tabSelfStyle = this.getTabBarStyle()
    return <View style={{ flexDirection: 'row', flex: 1 }} onLayout={() => this.handleLayout}>
      {state.routes.map((route, index) => {
        const focused = index === state.index
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const accessibilityLabel =
          options.tabBarAccessibilityLabel !== undefined
            ? options.tabBarAccessibilityLabel
            : typeof label === 'string'
              ? `${label}, tab, ${index + 1} of ${state.routes.length}`
              : undefined

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          })

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }

        const badge = getTabItemConfig(index, 'tabBarBadge')
        const showRedDot = getTabItemConfig(index, 'showRedDot') || false

        const labelColor = focused ? tabSelfStyle.selectedColor : tabSelfStyle.color
        const source = this.getTabIconSource(index, focused)

        if (Platform.OS === 'web') {
          const linkto = this.buildLink(route.name, route.params)
          return (
            <Link
              to={linkto}
              style={[]}
              onPress={(e: any) => {
                if (
                  !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
                  (e.button == null || e.button === 0)
                ) {
                  e.preventDefault()
                  onPress()
                }
              }}
            >
              <TabBarItem
                showRedDot={showRedDot}
                badge={badge}
                label={label}
                horizontal={horizontal}
                labelColor={labelColor}
                iconSource={source}
                size={25}
                {...this.props}
              />
            </Link>
          )
        } else {
          return (
            <TouchableWithoutFeedback
              key={options.tabBarTestID}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={accessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <View
                style={[styles.tab, horizontal ? styles.tabLandscape : styles.tabPortrait]}
              >
                <TabBarItem
                  label={label}
                  badge={badge}
                  showRedDot={showRedDot}
                  horizontal
                  labelColor={labelColor}
                  iconSource={source}
                  size={25}
                  {...this.props}
                />
              </View>
            </TouchableWithoutFeedback>
          )
        }
      })}
    </View>
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render () {
    const { insets, visible, layout, tabVisible, isKeyboardShown } = this.state
    const paddingBottom = Math.max(
      insets?.bottom - Platform.select({ ios: 4, default: 0 }), 5)

    const { style } = this.props

    const tabBarStyle = this.getTabBarStyle()
    const needAnimate = getTabConfig('needAnimate')

    const showTabBar = tabVisible !== false && !isKeyboardShown
    if (!needAnimate) {
      // eslint-disable-next-line multiline-ternary
      return (!showTabBar ? null
        : (
          <View
            style={[
              styles.tabBar,
              {
                height: this.getDefaultTabBarHeight() + paddingBottom,
                paddingBottom,
                paddingHorizontal: Math.max(insets.left, insets.right)
              },
              style,
              {
                backgroundColor: tabBarStyle.backgroundColor,
                borderTopColor: tabBarStyle.borderTopColor
              }
            ]}
          >
            {this.renderContent()}
          </View>)
      )
    } else {
      return (
        <Animated.View
          style={[
            styles.tabBar,
            {

              height: this.getDefaultTabBarHeight() + paddingBottom,
              paddingBottom,
              paddingHorizontal: Math.max(insets.left, insets.right)
            },
            {
              transform: [
                {
                  translateY: visible.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      layout.height + paddingBottom + StyleSheet.hairlineWidth,
                      0
                    ]
                  })
                }
              ],
              position: !tabVisible ? 'absolute' : (null as any)
            },
            style,
            {
              backgroundColor: tabBarStyle.backgroundColor,
              borderTopColor: tabBarStyle.borderTopColor
            }
          ]}
          pointerEvents={!tabVisible ? 'none' : 'auto'}
        >
          {this.renderContent()}
        </Animated.View>
      )
    }
  }
}

export default withSafeAreaInsets(TabBar)

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center'
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row'
  }
})
