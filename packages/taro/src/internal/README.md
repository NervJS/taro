# 内部方法 internal function

导出以 `internal_` 开头命名的函数，用户不需要关心也不会使用到的内部方法，在编译期会自动给每个使用 `taro-cli` 编译的文件加上其依赖并使用。例如：

```jsx
import { Component } from 'taro'

class C extends Component {
  render () {
    const { todo } = this.state
    return (
      <TodoItem
        id={todo[0].list[123].id}
      />
    )
  }
}
```

会被编译成：

```jsx
import { Component, internal_safe_get } from 'taro'

class C extends Component {
  $props = {
    TodoItem() {
      return {
        $name: "TodoItem",
        id: internal_safe_get(this.state, "todo[0].list[123].id"),
      }
    }
  }
  ...
}
```