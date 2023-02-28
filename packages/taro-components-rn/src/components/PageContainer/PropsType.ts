import { StyleProp, ViewStyle } from 'react-native'

export interface PageContainerProps {
    show?: boolean,
    duration?: number,
    zIndex?: number,
    overlay?: boolean,
    position?: 'top' | 'bottom' | 'right' | 'center',
    round?: boolean,
    onRequestClose?: () => void,
    onBeforeEnter?: () => void;
    onEnter?: () => void,
    onAfterEnter?: () => void;
    onBeforeLeave?: () => void;
    onLeave?: () => void,
    onAfterLeave?: () => void;
    overlayStyle?: StyleProp<ViewStyle>,
    customStyle?: StyleProp<ViewStyle>,
    children?: React.ReactNode,
}
