export const defaultTypes = [
  "all",
  "braille",
  "embossed",
  "handheld",
  "print",
  "projection",
  "screen",
  "speech",
  "tty",
  "tv",
];
export const cssnextMediaQueryTypes = ["pointer", "hover", "block-overflow"];
export const reactNativeMediaQueryTypes = [
  "android",
  "dom",
  "ios",
  "macos",
  "web",
  "windows",
];
export const mediaQueryTypes = defaultTypes
  .concat(cssnextMediaQueryTypes)
  .concat(reactNativeMediaQueryTypes);
