import React from 'react';
import Portal from '../portal';
import OperationContainer from './OperationContainer';

export default function a(...args: any[]) {
  const actions = args[0] || [{ text: '确定' }];

  const key = Portal.add(
    <OperationContainer
      actions={actions}
      onAnimationEnd={(visible: boolean) => {
        if (!visible) {
          Portal.remove(key);
        }
      }}
    />,
  );
}
