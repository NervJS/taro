// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  TextStyle
} from 'react-native'
import Badge from './Badge'

export interface TabBarOptions {
  activeTintColor: string,
  inactiveTintColor: string,
  activeBackgroundColor: string,
  inactiveBackgroundColor: string,
  tabStyle?: ViewStyle,
  labelStyle?: TextStyle,
  showLabel?: boolean,
  allowFontScaling?: boolean,
  keyboardHidesTabBar?: boolean,
  safeAreaInsets?: Record<string, number>
  style?: ViewStyle
}

export interface TabOptions {
  tabBarVisible?: boolean,
  tabBarBadge?: boolean,
  tabBarBadgeStyle?: Record<string, any>,
}
interface TabBarItemProps extends TabBarOptions{
  badge: number | string,
  showRedDot: boolean,
  label: string,
  horizontal: boolean,
  labelColor: string,
  iconSource: ImageSourcePropType
  size?: number,
  userOptions?: TabOptions
}

export default class TabBarItem extends React.PureComponent<TabBarItemProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render () {
    const {
      label,
      horizontal,
      showRedDot,
      badge,
      size = 20,
      labelColor,
      iconSource,
      userOptions,
      tabStyle = {},
      labelStyle = {},
      allowFontScaling = true,
      showLabel = true
    } = this.props
    const tabBarBadgeStyle = userOptions?.tabBarBadgeStyle || {}
    return (
      <View style={[styles.tabItem, styles.itemHorizontal, tabStyle]}>
        <View style={styles.icon}>
          {!!iconSource && <Image style={{ width: size, height: size }} source={iconSource} />}
          {!!showRedDot && !badge && <View style={styles.redDot} />}
          {!!badge && <Badge
            visible={badge != null}
            style={[
              styles.badge,
              horizontal ? styles.badgeHorizontal : styles.badgeVertical,
              tabBarBadgeStyle
            ]}
            size={(size * 3) / 4}
          >{('' + badge).length >= 4 ? '...' : badge}</Badge>
          }
        </View>
        {showLabel && <Text
          numberOfLines={1}
          allowFontScaling={allowFontScaling}
          style={[
            styles.label,
            horizontal ? styles.labelBeside : styles.labelBeneath,
            labelStyle,
            { color: labelColor }
          ]}
        >{label}</Text>}
      </View >
    )
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  labelBeneath: {
    fontSize: 12
  },
  labelBeside: {
    fontSize: 12,
    marginTop: 5
  },
  button: {
    display: 'flex'
  },
  icon: {
    justifyContent: 'flex-end'
  },
  tabItem: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  itemVertical: {
    flex: 1
  },
  itemHorizontal: {
    height: '100%',
    marginTop: 5
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -5,
    backgroundColor: '#FA5151',
    zIndex: 100,
    borderRadius: 18,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4
  },
  badge: {
    position: 'absolute',
    top: -3,
    zIndex: 10,
    left: 15
  },
  // todo
  badgeHorizontal: {},
  badgeVertical: {}
})
