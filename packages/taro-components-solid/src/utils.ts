import { h } from '@tarojs/solid';

export function createComponent(name: string) {
  return (props?) => {
    return h(name, props);
  };
}
