import { createComponent } from './utils';

export default props => {

  if (props.hasOwnProperty('focus')) {
    props.autoFocus = Boolean(props.focus);
    delete props.focus;
  }

  return createComponent('taro-input-core')(props);
};
