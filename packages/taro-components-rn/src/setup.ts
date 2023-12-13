import '@testing-library/jest-native/extend-expect'

jest.mock('react-native-webview', () => {
  const React = jest.requireActual('react')
  const { View } = jest.requireActual('react-native')
  const WebView = (props) => React.createElement(View, props)

  return {
    WebView,
    default: WebView,
    __esModule: true,
  }
})
