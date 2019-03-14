import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../../style';

export interface ModalStyle {
  container: ViewStyle;
  wrap: ViewStyle;
  popupContainer: ViewStyle;
  innerContainer: ViewStyle;
  popupSlideUp: ViewStyle;
  popupSlideDown: ViewStyle;
  footer: ViewStyle;
  header: TextStyle;
  body: ViewStyle;
  maskClosable: ViewStyle;
  closeWrap: ViewStyle;
  close: TextStyle;
  buttonGroupH: ViewStyle;
  buttonGroupV: ViewStyle;
  buttonWrapH: ViewStyle;
  buttonWrapV: ViewStyle;
  buttonText: TextStyle;
  operationContainer: ViewStyle;
  operationBody: ViewStyle;
  buttonTextOperation: TextStyle;
}

export default (theme: Theme) =>
  StyleSheet.create<ModalStyle>({
    container: {
      zIndex: theme.modal_zindex,
    },
    wrap: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupContainer: {},
    popupSlideUp: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    popupSlideDown: {},
    innerContainer: {
      borderRadius: theme.radius_md,
      width: 286,
      paddingTop: theme.v_spacing_xl,
      overflow: 'hidden',
    },
    // fix android borderRadius
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderBottomLeftRadius: theme.radius_md,
      borderBottomRightRadius: theme.radius_md,
    },
    header: {
      fontSize: theme.modal_font_size_heading,
      color: theme.color_text_base,
      textAlign: 'center',
      paddingHorizontal: theme.h_spacing_lg,
    },
    body: {
      paddingTop: 0,
      paddingBottom: theme.v_spacing_lg,
      paddingHorizontal: theme.h_spacing_lg,
    },
    maskClosable: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
    },
    closeWrap: {
      position: 'absolute',
      top: 0,
      left: theme.h_spacing_lg,
    },
    close: {
      fontSize: 40,
      fontWeight: '200',
      color: '#bcbcbc',
      lineHeight: 30,
    },
    buttonGroupH: {
      flexGrow: 1,
      flexDirection: 'row',
    },
    buttonGroupV: {
      flexGrow: 1,
      flexDirection: 'column',
    },
    buttonWrapH: {
      height: theme.modal_button_height,
      flexGrow: 1,
      justifyContent: 'center',
      borderColor: theme.border_color_base,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderRightWidth: StyleSheet.hairlineWidth,
      paddingVertical: 11,
    },
    buttonWrapV: {
      flexGrow: 1,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border_color_base,
      paddingVertical: 11,
    },
    buttonText: {
      textAlign: 'center',
      color: theme.color_link,
      fontSize: theme.modal_button_font_size,
      backgroundColor: 'transparent',
    },
    operationContainer: {
      paddingTop: 0,
    },
    operationBody: {
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    buttonTextOperation: {
      color: theme.color_text_base,
      textAlign: 'left',
      paddingHorizontal: 15,
    },
  });
