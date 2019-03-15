/* tslint:disable:no-console */
import React from 'react';
import { PickerProps } from './PickerTypes';

type ItemProps = {
  value: any;
};

const Item = (_props: ItemProps) => null;

export default function(ComposedComponent: any) {
  return class extends React.Component<PickerProps, any> {
    static Item = Item;

    select = (value: any, itemHeight: any, scrollTo: any) => {
      const children: any = React.Children.toArray(this.props.children);
      for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].props.value === value) {
          this.selectByIndex(i, itemHeight, scrollTo);
          return;
        }
      }
      this.selectByIndex(0, itemHeight, scrollTo);
    };

    selectByIndex(index: number, itemHeight: any, zscrollTo: any) {
      if (
        index < 0 ||
        index >= React.Children.count(this.props.children) ||
        !itemHeight
      ) {
        return;
      }
      zscrollTo(index * itemHeight);
    }

    computeChildIndex(top: any, itemHeight: any, childrenLength: number) {
      const index = Math.round(top / itemHeight);
      return Math.min(index, childrenLength - 1);
    }

    doScrollingComplete = (top: any, itemHeight: any, fireValueChange: any) => {
      const children = React.Children.toArray(this.props.children);
      const index = this.computeChildIndex(top, itemHeight, children.length);
      const child: any = children[index];
      if (child) {
        fireValueChange(child.props.value);
      } else if (console.warn) {
        console.warn('child not found', children, index);
      }
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          doScrollingComplete={this.doScrollingComplete}
          computeChildIndex={this.computeChildIndex}
          select={this.select}
        />
      );
    }
  };
}
