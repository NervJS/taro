import deepmerge from 'deepmerge';
import React, { useContext } from 'react';
import defaultTheme from './themes/default';
export const ThemeContext = React.createContext(defaultTheme);
export type Theme = typeof defaultTheme & { [key: string]: any };
export type PartialTheme = Partial<Theme>;
export interface ThemeProviderProps {
  value?: PartialTheme;
  children?: React.ReactNode;
}
export const ThemeProvider = (props: ThemeProviderProps) => {
  const theme = { ...defaultTheme, ...props.value };
  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};
export interface UseThemeContextProps {
  theme?: PartialTheme;
}
export const useTheme = (props: UseThemeContextProps = {}) => {
  const theme = useContext(ThemeContext);
  return { ...theme, ...props.theme };
};

export interface WithThemeProps<T, S> {
  themeStyles: (theme: Theme) => T;
  styles?: S;
  children: (
    // fix: styles[`${size}RawText`]
    styles: T & { [key: string]: any },
    theme: Theme,
  ) => React.ReactNode;
}

/**
 * Component can extends this props
 */
export type WithThemeStyles<T> = { styles?: Partial<T> };
export class WithTheme<T, S> extends React.Component<WithThemeProps<T, S>> {
  static defaultProps = {
    themeStyles: () => {},
  };
  getStyles = (theme: Theme) => {
    const { themeStyles, styles } = this.props;
    const defaultThemeStyles = themeStyles(theme);
    if (styles) {
      // TODO: check these styles has changed
      // merge styles from user defined
      return deepmerge<T>(defaultThemeStyles, styles);
    }
    return defaultThemeStyles;
  };
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => this.props.children(this.getStyles(theme), theme)}
      </ThemeContext.Consumer>
    );
  }
}
