// @Todo:
// [x] 不能在 props 的值中传入 JSX
// <View test={() => <View />} />
// [x] 不能使用 map 之外 其他数组方法操作 JSX 数组
// elements.push(<View />)
// [x] 不能在循环中继续加入表达式? 待研究转换解决方案
// this.state.list.map(l => {
// const foo = l.id
// return <View bar={foo} />
// })
// [x] 自定义组件 children
// [x] 函数表达式
// [x] 不能在循环中使用 if
