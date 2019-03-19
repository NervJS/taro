
import PropTypes from 'prop-types';
import React from 'react';
import { KeyboardAvoidingView, Text, TextInput, TextStyle, View } from 'react-native';
import { WithTheme, WithThemeStyles } from '../style';
import Modal from './Modal';
import { CallbackOrActions } from './PropsType';
import promptStyles, { PromptStyle } from './style/prompt';

export interface PropmptContainerProps extends WithThemeStyles<PromptStyle> {
  title: React.ReactNode;
  message?: React.ReactNode;
  type?: 'default' | 'login-password' | 'secure-text';
  defaultValue?: string;
  actions: CallbackOrActions<TextStyle>;
  onAnimationEnd?: (visible: boolean) => void;
  placeholders?: string[];
}

export default class PropmptContainer extends React.Component<
  PropmptContainerProps,
  any
> {
  static defaultProps = {
    type: 'default',
    defaultValue: '',
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  constructor(props: PropmptContainerProps) {
    super(props);
    this.state = {
      visible: true,
      text: props.defaultValue,
      password: props.type === 'secure-text' ? props.defaultValue : '',
    };
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChangeText(type: string, value: string) {
    this.setState({
      [type]: value,
    });
  }

  render() {
    const {
      title,
      onAnimationEnd,
      message,
      type,
      actions,
      placeholders,
    } = this.props;
    const { text, password } = this.state;
    const getArgs = function(func: (...args: any[]) => void) {
      if (type === 'login-password') {
        return func.apply(this, [text, password]);
      } else if (type === 'secure-text') {
        return func.apply(this, [password]);
      }
      return func.apply(this, [text]);
    };

    // tslint:disable-next-line:variable-name
    const _locale = {
      okText: '确定',
      cancelText: '取消',
      buttonText: '按钮',
    };

    let callbacks;
    if (typeof actions === 'function') {
      callbacks = [
        { text: _locale.cancelText, style: 'cancel', onPress: () => {} },
        { text: _locale.okText, onPress: () => getArgs(actions) },
      ];
    } else {
      callbacks = actions.map(item => {
        return {
          text: item.text,
          onPress: () => {
            if (item.onPress) {
              return getArgs(item.onPress);
            }
          },
          style: item.style || {},
        };
      });
    }

    const footer = (callbacks as any).map((button: any) => {
      // tslint:disable-next-line:only-arrow-functions
      const orginPress = button.onPress || function() {};
      button.onPress = () => {
        const res = orginPress();
        if (res && res.then) {
          res.then(() => {
            this.onClose();
          });
        } else {
          this.onClose();
        }
      };
      return button;
    });

    return (
      <WithTheme styles={this.props.styles} themeStyles={promptStyles}>
        {styles => {
          const firstStyle = [styles.inputWrapper];
          const lastStyle = [styles.inputWrapper];

          if (type === 'login-password') {
            firstStyle.push(styles.inputFirst);
            lastStyle.push(styles.inputLast);
          } else if (type === 'secure-text') {
            lastStyle.push(styles.inputFirst);
            lastStyle.push(styles.inputLast);
          } else {
            firstStyle.push(styles.inputFirst);
            firstStyle.push(styles.inputLast);
          }

          return (
            <Modal
              transparent
              title={title}
              visible={this.state.visible}
              footer={footer}
              onAnimationEnd={onAnimationEnd}
            >
              <KeyboardAvoidingView behavior="padding">
                {message ? <Text style={styles.message}>{message}</Text> : null}
                <View style={styles.inputGroup}>
                  {type !== 'secure-text' && (
                    <View style={firstStyle}>
                      <TextInput
                        autoFocus
                        onChangeText={value => {
                          this.onChangeText('text', value);
                        }}
                        value={this.state.text}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={placeholders![0]}
                      />
                    </View>
                  )}
                  {(type === 'secure-text' || type === 'login-password') && (
                    <View style={lastStyle}>
                      <TextInput
                        autoFocus
                        secureTextEntry
                        onChangeText={value => {
                          this.onChangeText('password', value);
                        }}
                        value={this.state.password}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={placeholders![1]}
                      />
                    </View>
                  )}
                </View>
              </KeyboardAvoidingView>
            </Modal>
          );
        }}
      </WithTheme>
    );
  }
}
