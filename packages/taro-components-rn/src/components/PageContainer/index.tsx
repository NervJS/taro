import React from 'react'
import { Modal } from 'react-native'
import Container from './container'

import { PageContainerProps } from './PropsType'

/**
 * NOTE：当用户进行返回操作时（右滑手势、安卓物理返回键），触发 onRequestClose 回调
 */
class _PageContainer extends React.Component<PageContainerProps, any> {
  static defaultProps = {
    show: false,
    duration: 300,
    overlay: true,
    round: false,
    position: 'bottom'
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  componentDidUpdate(prevProps) {
    const { onBeforeEnter, onAfterLeave } = this.props
    // false -> true
    if (!prevProps.show && this.props.show) {
      onBeforeEnter && onBeforeEnter()
    }
    // true -> false
    if (prevProps.show && !this.props.show) {
      onAfterLeave && onAfterLeave()
    }
  }

  render(): JSX.Element {
    const {
      children,
      show,
      duration,
      overlay,
      round,
      position,
      onRequestClose,
      onEnter,
      onAfterEnter,
      onBeforeLeave,
      onLeave,
      overlayStyle,
      customStyle
    } = this.props
    return (
      <Modal
        visible={show}
        transparent={true}
        animationType="fade"
        onRequestClose={onRequestClose}
        onShow={onEnter}
        // onDismiss={onLeave} // NOTE: 该属性只支持 iOS，故不用该属性
      >
        <Container
          overlayStyle={overlayStyle}
          customStyle={customStyle}
          duration={duration}
          overlay={overlay}
          round={round}
          position={position}
          onAfterEnter={onAfterEnter}
          onBeforeLeave={onBeforeLeave}
          onLeave={onLeave}
        >
          {children}
        </Container>
      </Modal>
    )
  }
}

export default _PageContainer
