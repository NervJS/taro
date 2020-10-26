// import * as ReactNative from 'react-native';

// declare module 'react-native' {
//   interface ARTStatic {
//     Transform: any;
//   }
// }

declare module 'react-dom/server.browser' {
  // eslint-disable-next-line no-unused-vars
  import { ReactElement } from 'react'

  export const renderToStaticMarkup: (element: ReactElement) => string
}
