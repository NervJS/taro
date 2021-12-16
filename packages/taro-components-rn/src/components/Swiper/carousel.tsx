/**
 * 注意：Carousel 组件由组件 @ant-design/react-native/lib/carousel 私有化并修改而成
 * https://github.com/ant-design/ant-design-mobile-rn/tree/master/components/carousel
 *
 * 依赖 react-native-pager-view 实现
 *
 */
import ViewPager from 'react-native-pager-view'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CarouselProps } from './PropsType'
import defaultPagination from './pagination'

const styles = StyleSheet.create({
  wrapperStyle: {
    overflow: 'hidden',
  },
})

const INFINITEBUFFER = 2

export interface CarouselState {
  selectedIndex: number; // ViewPager 使用的 Index
}

class Carousel extends React.Component<CarouselProps, CarouselState> {
  static defaultProps: CarouselProps = {
    infinite: false,
    dots: true,
    autoplay: false,
    autoplayInterval: 3000,
    selectedIndex: 0,
    vertical: false,
    pagination: defaultPagination,
    dotStyle: {},
    dotActiveStyle: {},
  };

  viewPager = React.createRef<ViewPager>();

  private autoplayTimer: number;
  private isScrolling: boolean;

  constructor(props: CarouselProps) {
    super(props)
    const { selectedIndex } = this.props
    this.isScrolling = false
    this.state = {
      selectedIndex: this.getVirtualIndex(selectedIndex as number),
    }
  }

  componentDidMount(): void {
    this.autoplay()
  }

  componentWillUnmount(): void {
    clearTimeout(this.autoplayTimer)
  }

  componentDidUpdate(prevProps: CarouselProps): void {
    if (
      (prevProps.autoplay !== undefined && prevProps.autoplay !== this.props.autoplay) ||
      (prevProps.infinite !== undefined && prevProps.infinite !== this.props.infinite)
    ) {
      this.autoplay(!this.props.autoplay)
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props: CarouselProps): void {
    const { selectedIndex, infinite } = props
    const index = this.getVirtualIndex(selectedIndex as number, infinite)
    if (index !== this.state.selectedIndex) {
      this.goTo(index)
    }
  }

  public goTo(index: number): void {
    this.viewPager.current && this.viewPager.current.setPage(index)
  }

  public getIndex(index: number, count: number): number {
    const { infinite } = this.props
    if (!infinite) return index
    if (index < INFINITEBUFFER) {
      return count - INFINITEBUFFER + index
    } else if (index > count + INFINITEBUFFER - 1) {
      return index - count - INFINITEBUFFER
    } else {
      return index - INFINITEBUFFER
    }
  }

  // infinite 默认取 props，如为 next props 需传入
  public getVirtualIndex(index: number, infinite?: boolean): number {
    const infi = infinite ?? this.props.infinite
    if (!infi) return index
    return index + INFINITEBUFFER
  }

  render(): any {
    const { selectedIndex } = this.state
    const { dots, children, vertical, infinite } = this.props

    if (!children) {
      return (
        <Text style={{ backgroundColor: 'white' }}>
          You are supposed to add children inside Carousel
        </Text>
      )
    }

    const count = this.getChildrenCount(children)
    let pages: React.ReactFragment

    if (count > 1) {
      const childrenArray = React.Children.toArray(children)

      if (infinite) {
        for (let index = 0; index < INFINITEBUFFER; index++) {
          childrenArray.push(React.cloneElement(children[index], { ref: null }))
          childrenArray.unshift(React.cloneElement(children[count - index - 1], { ref: null }))
        }
      }

      pages = childrenArray.map((page, i) => {
        return (
          // when vertical, use the height of the first child as the height of the Carousel
          <View key={i}>{page}</View>
        )
      })
    } else {
      pages = <View>{children}</View>
    }
    const vpProps = {
      initialPage: selectedIndex,
      showPageIndicator: false,
      onPageSelected: e => {
        const pos = e.nativeEvent.position
        const prevIndex = this.getIndex(this.state.selectedIndex, count)
        this.setState({ selectedIndex: pos }, () => {
          this.autoplay()
        })
        const actualIndex = this.getIndex(pos, count)
        if (this.props.afterChange && prevIndex !== actualIndex) {
          this.props.afterChange(actualIndex)
        }
      },
      onPageScroll: (e) => {
        const pos = e.nativeEvent.position
        if (infinite) {
          if (pos === count + INFINITEBUFFER) {
            this.viewPager.current && this.viewPager.current.setPageWithoutAnimation(INFINITEBUFFER)
          } else if (pos === INFINITEBUFFER - 1) {
            this.viewPager.current && this.viewPager.current.setPageWithoutAnimation(count + INFINITEBUFFER)
          }
        }
      },
      onPageScrollStateChanged: e => {
        switch (e.nativeEvent.pageScrollState) {
          case 'dragging':
            this.autoplay(true)
            this.isScrolling = true
            break
          case 'idle':
            this.autoplay()
            this.isScrolling = false
            break
          case 'settling':
            this.autoplay()
            this.isScrolling = false
            break
          default:
            break
        }
      },
    }
    return (
      <View
        style={[styles.wrapperStyle]}
      >
        <ViewPager
          {...vpProps}
          style={this.props.style}
          // Lib does not support dynamically orientation change
          orientation={vertical ? 'vertical' : 'horizontal'}
          // Lib does not support dynamically transitionStyle change
          transitionStyle="scroll"
          ref={this.viewPager as any}
        >
          {pages}
        </ViewPager>
        {dots && this.renderDots(this.getIndex(selectedIndex, count))}
      </View>
    )
  }

  private getChildrenCount = (children: React.ReactNode) => {
    const count = children ? React.Children.count(children) || 1 : 0
    return count
  };

  private autoplay = (stop = false) => {
    if (stop) {
      clearTimeout(this.autoplayTimer)
      return
    }
    const { children, autoplay, infinite, autoplayInterval } = this.props
    const { selectedIndex } = this.state
    const count = this.getChildrenCount(children)
    if (!Array.isArray(children) || !autoplay || this.isScrolling) {
      return
    }

    clearTimeout(this.autoplayTimer)

    this.autoplayTimer = setTimeout(() => {
      let newIndex = selectedIndex < this.getVirtualIndex(count) ? selectedIndex + 1 : 0
      if (selectedIndex === count - 1) {
        newIndex = 0
        if (!infinite) {
          clearTimeout(this.autoplayTimer)
          return
        }
      }
      if (infinite) {
        newIndex = this.getVirtualIndex(this.getIndex(newIndex, count))
      }
      this.goTo(newIndex)
    }, autoplayInterval)
  };

  private renderDots = (index: number) => {
    const {
      children,
      vertical,
      pagination,
      dotStyle,
      dotActiveStyle,
    } = this.props
    if (!pagination) {
      return null
    }
    const count = this.getChildrenCount(children)
    return pagination({
      styles,
      vertical,
      current: index,
      count,
      dotStyle,
      dotActiveStyle,
    })
  };
}

export default Carousel
