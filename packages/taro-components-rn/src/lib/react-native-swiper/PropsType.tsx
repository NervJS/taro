import { StyleProp, ViewStyle } from 'react-native';

export interface ReactNativeSwiperProps {
  children: any;

  // Basic
  // If true, the scroll view's children are arranged horizontally in a row instead of vertically in a column.
  horizontal?: boolean;
  // If no specify default enable fullscreen mode by flex: 1.
  loop?: boolean;
  // Set to false to disable continuous loop mode.
  autoplay?: boolean;
  // Set to true make control buttons visible.
  showsButtons?: boolean;
  // Index number of initial slide.
  index?: number;
  // Called with the new index when the user swiped
  onIndexChanged?: (index: number) => void;

  // Custom basic style & content
  // Set to true enable auto play mode.
  width?: number;
  // If no specify default fullscreen mode by flex: 1.
  height?: number;
  // See default style in source.
  style?: StyleProp<ViewStyle>;
  // Only load current index slide , loadMinimalSize slides before and after.
  loadMinimal?: boolean;
  // see loadMinimal
  loadMinimalSize?: number;
  // Custom loader to display when slides aren't loaded
  loadMinimalLoader?: React.ReactNode;

  // Pagination
  // Set to true make pagination visible.
  showsPagination?: boolean;
  // Custom styles will merge with the default styles.
  paginationStyle?: ViewStyle;
  // Complete control how to render pagination with three params (index, total, context) ref to this.state.index / this.state.total / this, For example: show numbers instead of dots.
  renderPagination?: (index: number, total: number, swiper: any) => JSX.Element;
  // Allow custom the dot element.
  dot?: any;
  // Allow custom the active-dot element.
  activeDot?: any;
  // Allow custom the active-dot element.
  dotStyle?: StyleProp<ViewStyle>;
  // Allow custom the active-dot element.
  dotColor?: string;
  // Allow custom the active-dot element.
  activeDotColor?: string;
  // Allow custom the active-dot element.
  activeDotStyle?: StyleProp<ViewStyle>;

  // Autoplay
  // Delay between auto play transitions (in second).
  autoplayTimeout?: number;
  // Cycle direction control.
  autoplayDirection?: boolean;

  // Control buttons
  // Set to true make control buttons visible.
  buttonWrapperStyle?: any;
  // Allow custom the next button.
  nextButton?: JSX.Element;
  // Allow custom the prev button.
  prevButton?: JSX.Element;

  // Supported ScrollResponder
  // When animation begins after letting up
  onScrollBeginDrag?: any;
  // Makes no sense why this occurs first during bounce
  onMomentumScrollEnd?: any;
  // Immediately after onMomentumScrollEnd
  onTouchStartCapture?: any;
  // Same, but bubble phase
  onTouchStart?: any;
  // You could hold the touch start for a long time
  onTouchEnd?: any;
  // When lifting up - you could pause forever before * lifting
  onResponderRelease?: any;

  // If true, the scroll view stops on multiples of the scroll view's size when scrolling. This can be used for
  // horizontal pagination.
  pagingEnabled?: boolean;
  // Set to true if you want to show horizontal scroll bar.
  showsHorizontalScrollIndicator?: boolean
  // Set to true if you want to show vertical scroll bar.
  showsVerticalScrollIndicator?: boolean
  // If true, the scroll view bounces when it reaches the end of the content if the content is larger then the
  // scroll view along the axis of the scroll direction. If false, it disables all bouncing even if the
  // alwaysBounce* props are true.
  bounces?: boolean
  // If true, the scroll view scrolls to top when the status bar is tapped.
  scrollsToTop?: boolean
  // If true, offscreen child views (whose overflow value is hidden) are removed from their native backing
  // superview when offscreen. This canimprove scrolling performance on long lists.
  removeClippedSubviews?: boolean
  // Set to true if you need adjust content insets automation.
  automaticallyAdjustContentInsets?: boolean
  // Enables/Disables swiping
  scrollEnabled?: boolean

  containerStyle?: StyleProp<ViewStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  disableNextButton?: boolean;
}

export interface ReactNativeSwiperState {
  width: number;
  height: number;
  offset: Partial<{
    x: number;
    y: number;
  }>,
  autoplayEnd?: boolean;
  loopJump?: boolean;
  total: number;
  index: number;
  dir: 'x' | 'y';
  pIndex: number;
}
