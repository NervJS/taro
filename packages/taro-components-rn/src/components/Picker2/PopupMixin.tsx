import React from 'react';
import { View } from 'react-native';
import { PopupPickerProps } from './PopupPickerTypes';

export default function PopupMixin(
  getModal: (
    props: any,
    visible: any,
    { getContent, hide, onDismiss, onOk }: any,
  ) => JSX.Element,
  platformProps: {
    actionTextUnderlayColor: string;
    actionTextActiveOpacity: number;
    triggerType: string;
    styles: {};
    WrapComponent: View;
  },
) {
  return class extends React.Component<PopupPickerProps, any> {
    static defaultProps = {
      onVisibleChange(_: any) {},
      okText: 'Ok',
      dismissText: 'Dismiss',
      title: '',
      onOk(_: any) {},
      onDismiss() {},
      ...platformProps,
    };

    picker: any;

    constructor(props: Readonly<PopupPickerProps>) {
      super(props);

      this.state = {
        pickerValue: 'value' in this.props ? this.props.value : null,
        visible: this.props.visible || false,
      };
    }

    componentWillReceiveProps(nextProps: { value: any; visible: any }) {
      if ('value' in nextProps) {
        this.setState({
          pickerValue: nextProps.value,
        });
      }
      if ('visible' in nextProps) {
        this.setVisibleState(nextProps.visible);
      }
    }

    onPickerChange = (pickerValue: any) => {
      if (this.state.pickerValue !== pickerValue) {
        this.setState({
          pickerValue,
        });
        const { picker, pickerValueChangeProp } = this.props;
        if (picker && picker.props[pickerValueChangeProp!]) {
          picker.props[pickerValueChangeProp!](pickerValue);
        }
      }
    };

    saveRef = (picker: any) => {
      this.picker = picker;
    };

    setVisibleState(visible: any) {
      this.setState({
        visible,
      });
      if (!visible) {
        this.setState({
          pickerValue: null,
        });
      }
    }

    fireVisibleChange(visible: boolean) {
      if (this.state.visible !== visible) {
        if (!('visible' in this.props)) {
          this.setVisibleState(visible);
        }
        this.props.onVisibleChange!(visible);
      }
    }

    getRender() {
      const props = this.props;
      const children = props.children;
      if (!children) {
        return getModal(props, this.state.visible, {
          getContent: this.getContent,
          onOk: this.onOk,
          hide: this.hide,
          onDismiss: this.onDismiss,
        });
      }
      const { WrapComponent, disabled } = this.props;
      const child = children;
      const newChildProps = {};
      if (!disabled) {
        (newChildProps as any)[props.triggerType!] = this.onTriggerClick;
      }
      return (
        <WrapComponent style={props.wrapStyle}>
          {React.cloneElement(child as any, newChildProps)}
          {getModal(props, this.state.visible, {
            getContent: this.getContent,
            onOk: this.onOk,
            hide: this.hide,
            onDismiss: this.onDismiss,
          })}
        </WrapComponent>
      );
    }

    onTriggerClick = (e: any) => {
      const child: any = this.props.children;
      const childProps = child.props || {};
      if (childProps[this.props.triggerType!]) {
        childProps[this.props.triggerType!](e);
      }
      this.fireVisibleChange(!this.state.visible);
    };

    onOk = () => {
      this.props.onOk!(this.picker && this.picker.getValue());
      this.fireVisibleChange(false);
    };

    getContent = () => {
      if (this.props.picker) {
        let { pickerValue } = this.state;
        if (pickerValue === null) {
          pickerValue = this.props.value;
        }
        return React.cloneElement(this.props.picker, {
          [this.props.pickerValueProp!]: pickerValue,
          [this.props.pickerValueChangeProp!]: this.onPickerChange,
          ref: this.saveRef,
        });
      } else {
        return this.props.content;
      }
    };

    onDismiss = () => {
      this.props.onDismiss!();
      this.fireVisibleChange(false);
    };

    hide = () => {
      this.fireVisibleChange(false);
    };

    render() {
      return this.getRender();
    }
  };
}
