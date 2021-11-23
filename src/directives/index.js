
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted (dom, options) {
    dom.onerror = function () {
      // dom可以注册error事件
      dom.src = options.value
    }
  }
}
