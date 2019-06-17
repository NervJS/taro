import {
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';

export interface ReactNativeSwiperProps extends ScrollViewProps {
  children: any;

  containerStyle?: StyleProp<ViewStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  // -> ScrollView.contentContainerStyle
  style?: StyleProp<ViewStyle>;
  // Custom styles will merge with the default styles.
  paginationStyle?: ViewStyle;
  // Allow custom the active-dot element.
  dotStyle?: StyleProp<ViewStyle>;
  // Allow custom the active-dot element.
  activeDotStyle?: StyleProp<ViewStyle>;

  // Basic
  // If true, the scroll view's children are arranged horizontally in a row instead of vertically in a column.
  horizontal?: boolean;
  // If no specify default enable fullscreen mode by flex: 1.
  loop?: boolean;
  // Set to false to disable continuous loop mode.
  autoplay?: boolean;
  // Index number of initial slide.
  index?: number;
  // Called with the new index when the user swiped
  onIndexChanged?: (index: number) => void;

  // Custom basic style & content
  width?: number;
  // If no specify default fullscreen mode by flex: 1.
  height?: number;
  // Only load current index slide , loadMinimalSize slides before and after.
  loadMinimal?: boolean;
  // see loadMinimal
  loadMinimalSize?: number;
  // Custom loader to display when slides aren't loaded
  loadMinimalLoader?: React.ReactNode;

  // Pagination
  // Set to true make pagination visible.
  showsPagination?: boolean;
  // Complete control how to render pagination with three params (index, total, context) ref to this.state.index / this.state.total / this, For example: show numbers instead of dots.
  renderPagination?: (index: number, total: number, swiper: any) => JSX.Element;
  // Allow custom the dot element.
  dot?: any;
  // Allow custom the active-dot element.
  activeDot?: any;
  // Allow custom the active-dot element.
  dotColor?: string;
  // Allow custom the active-dot element.
  activeDotColor?: string;

  // Autoplay
  // Delay between auto play transitions (in second).
  autoplayTimeout?: number;
  // Cycle direction control.
  autoplayDirection?: boolean;

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

  // ...ScrollViewProps
  // pagingEnabled?: boolean;
  // showsHorizontalScrollIndicator?: boolean;
  // showsVerticalScrollIndicator?: boolean;
  // bounces?: boolean;
  // scrollsToTop?: boolean;
  // removeClippedSubviews?: boolean;
  // automaticallyAdjustContentInsets?: boolean;
  // scrollEnabled?: boolean;
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
