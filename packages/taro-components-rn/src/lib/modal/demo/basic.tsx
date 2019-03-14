/* tslint:disable:no-console */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Modal, Toast, WhiteSpace, WingBlank } from '../../';

export default class BasicModalExample extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      visible2: false,
    };
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onClose1 = () => {
    this.setState({
      visible1: false,
    });
  };

  onClose2 = () => {
    this.setState({
      visible2: false,
    });
  };

  onButtonClick = () => {
    Modal.alert('Title', 'alert content', [
      { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: 'OK', onPress: () => console.log('ok') },
    ]);
  };

  onButtonClick2 = () => {
    Modal.operation([
      { text: '标为未读', onPress: () => console.log('标为未读被点击了') },
      { text: '置顶聊天', onPress: () => console.log('置顶聊天被点击了') },
    ]);
  };

  onButtonClick3 = () => {
    Modal.prompt(
      'Login',
      'Pleas input login information',
      (login: any, password: any) =>
        console.log(`login: ${login}, password: ${password}`),
      'login-password',
      '',
      ['Please input name', 'Please input password'],
    );
  };

  onButtonClick4 = () => {
    Modal.prompt(
      'Input password',
      'password message',
      (password: any) => console.log(`password: ${password}`),
      'secure-text',
      'defaultValue',
    );
  };

  onButtonClick5 = () => {
    Modal.prompt(
      'Name',
      'name message',
      (password: any) => console.log(`password: ${password}`),
      'default',
      '',
      ['please input name'],
    );
  };
  render() {
    const footerButtons = [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      { text: 'Ok', onPress: () => console.log('ok') },
    ];
    return (
      <ScrollView style={{ marginTop: 20 }}>
        <WingBlank>
          <Button onPress={() => this.setState({ visible: true })}>
            showModal
          </Button>
          <WhiteSpace />
          <Button onPress={() => this.setState({ visible1: true })}>
            transparent:false
          </Button>
          <WhiteSpace />
          <Button onPress={() => this.setState({ visible2: true })}>
            popup
          </Button>
          <WhiteSpace />
          <Button onPress={this.onButtonClick}>Modal.alert</Button>
          <WhiteSpace />
          <Button onPress={this.onButtonClick2}>Modal.opertation</Button>
          <WhiteSpace />
          <Button onPress={this.onButtonClick5}>Modal.prompt (default)</Button>
          <WhiteSpace />
          <Button onPress={this.onButtonClick3}>
            Modal.prompt (login-password)
          </Button>
          <WhiteSpace />
          <Button onPress={this.onButtonClick4}>
            Modal.prompt (secure-text)
          </Button>
        </WingBlank>
        <Modal
          title="Title"
          transparent
          onClose={this.onClose}
          maskClosable
          visible={this.state.visible}
          closable
          footer={footerButtons}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
          </View>
          <Button type="primary" onPress={this.onClose}>
            close modal
          </Button>
        </Modal>
        <Modal
          transparent={false}
          visible={this.state.visible1}
          animationType="slide-up"
          onClose={this.onClose1}
        >
          <View style={{ paddingVertical: 220 }}>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
          </View>
          <Button
            type="primary"
            onPress={() => Toast.info('Hello Toast in Modal now works')}
          >
            Hello Toast in Modal now works
          </Button>
          <Button type="primary" onPress={this.onClose1}>
            close modal
          </Button>
        </Modal>
        <Modal
          popup
          visible={this.state.visible2}
          animationType="slide-up"
          onClose={this.onClose2}
        >
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
            <Text style={{ textAlign: 'center' }}>Content...</Text>
          </View>
          <Button type="primary" onPress={this.onClose2}>
            close modal
          </Button>
        </Modal>
      </ScrollView>
    );
  }
}
