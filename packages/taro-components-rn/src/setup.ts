import '@testing-library/jest-native/extend-expect'
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  const WebView = (props) => React.createElement(View, props);

  return {
    WebView,
    default: WebView,
    __esModule: true,
  };
});