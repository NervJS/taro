import * as React from 'react';
import Portal from '../portal';
import { Theme, ThemeProvider } from '../style';

export interface ProviderProps {
  theme?: Partial<Theme>;
}

export default class Provider extends React.Component<ProviderProps> {
  render() {
    return (
      <ThemeProvider value={this.props.theme}>
        <Portal.Host>{this.props.children}</Portal.Host>
      </ThemeProvider>
    );
  }
}
