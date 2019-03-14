import React from 'react';
import Portal from '../portal';
import AlertContainer from './AlertContainer';
import { Action } from './PropsType';

export default function a(
  title: React.ReactNode,
  content: React.ReactNode,
  actions: Action[] = [{ text: '确定' }],
) {
  const key = Portal.add(
    <AlertContainer
      title={title}
      content={content}
      actions={actions}
      onAnimationEnd={(visible: boolean) => {
        if (!visible) {
          Portal.remove(key);
        }
      }}
    />,
  );
}
