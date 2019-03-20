// The MIT License
//
// Copyright (c) 2019 Google, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as React from 'react';
import List, {ListProps} from '@material/react-list';
import {MDCMenuFoundation} from '@material/menu/foundation';

export interface MenuListProps<T extends HTMLElement> extends Exclude<ListProps<T>, 'ref'> {
  innerRef?: React.Ref<React.ReactElement<List>>;
  handleItemAction?: MDCMenuFoundation['handleItemAction'];
};

class MenuList<T extends HTMLElement = HTMLElement>
  extends React.Component<MenuListProps<T>, {}> {
  private listInstance = React.createRef<List>();

  static defaultProps: Partial<MenuListProps<HTMLElement>> = {
    className: '',
    handleSelect: () => {},
    handleItemAction: () => {},
  };

  get listElements(): Element[] {
    if (!this.listInstance.current) {
      return [];
    }
    return this.listInstance.current.listElements;
  }

  handleSelect: ListProps<HTMLElement>['handleSelect'] = (activatedItemIndex, selected) => {
    this.props.handleSelect!(activatedItemIndex, selected);
    this.props.handleItemAction!(this.listElements[activatedItemIndex]);
  }


  attachRef: React.Ref<React.ReactElement<List>> = (node) => {
    const {innerRef} = this.props;

    // https://github.com/facebook/react/issues/13029#issuecomment-410002316
    // @ts-ignore this is acceptable according to the comment above
    this.listInstance.current = node;

    if (!innerRef) {
      return;
    }

    if (typeof innerRef !== 'function') {
      // @ts-ignore same as above
      innerRef.current = node;
    } else {
      innerRef(node);
    }
  }

  render() {
    const {
      'aria-hidden': ariaHidden,
      handleSelect,
      role,
      children,
      ...otherProps
    } = this.props;
  

      return (
        <List
          aria-hidden={ariaHidden !== undefined ? ariaHidden : 'true'}
          ref={this.attachRef}
          role={role || 'menu'}
          handleSelect={this.handleSelect}
          {...otherProps}
        >
          {children}
        </List>
      );
  }

}

export default MenuList;