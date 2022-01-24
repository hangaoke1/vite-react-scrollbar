## 前言

[DEMO在线地址](https://hangaoke1.github.io/vite-react-scrollbar/)

[DEMO源码地址](https://github.com/hangaoke1/vite-react-scrollbar)

在平常业务开发中，如果我们需要实现一个滚动列表，通常的做法是给容器添加css样式，来实现滚动
```css
.scroll {
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid #eee;
}
```
但是此方式在PC端浏览器中会导致以下问题
1. 列表项布局被挤压
2. 如果内容是异步加载的，那么很可能会出现布局抖动，滚动条从`无`到`有`

![image.png](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/image/react-scrollbar-1.png)

如上图，一个`200px`宽度的容器，实际内部布局只剩下`183px`了，对于ui来说，在做视觉稿时，因为滚动条的出现导致视觉不稳定是不可接受的

![imag.gif](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/scrollbar-overflow.gif)

如上图，如果数据异步加载，而且列表项右侧有数据的话，会明显感受到布局挤压的抖动过程

### 解决方案一、使用overflow: overlay

![image.png](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/image/react-scrollbar-2.png)

![image.png](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/image/react-scrollbar-3.png)

如上图所示使用`overflow: overlay`后，滚动条不在影响列表项布局，而是悬浮在上面，该属性只兼容于基于webkit或blink的浏览器，在其他浏览器下，表现差强人意，有的降级成`auto`有的则直接不显示滚动条

### 解决方案二、使用负margin隐藏滚动条 + 虚拟滚动条

方案注意点：
1. 浏览器滚动条宽度计算
2. 需要监听内容变化，动态计算虚拟滚动条尺寸
3. 虚拟滚动条功能实现，包括轨道点击和thumb点击逻辑处理

```js
// 原生浏览器滚动条宽度计算
let scrollBarWidth: number | undefined;

export function calcScrollBarWidth() {
  if (scrollBarWidth !== undefined) return scrollBarWidth

  const outer = document.createElement('div')
  outer.className = 'v-scrollbar__calc'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}
```

```js
// 监听dom尺寸变化
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from 'throttle-debounce'

const isServer = typeof window === 'undefined'

const resizeHandler = function (entries: any) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn: () => void) => {
        fn()
      })
    }
  }
}

export const addResizeListener = function (element: any, fn: () => void) {
  if (isServer) return
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    element.__ro__ = new ResizeObserver(debounce(16, resizeHandler))
    element.__ro__.observe(element)
  }
  element.__resizeListeners__.push(fn)
}

export const removeResizeListener = function (element: any, fn: () => void) {
  if (!element || !element.__resizeListeners__) return
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect()
  }
}

```


> 三种方案的实现效果对比

![image.gif](https://hgkcdn.oss-cn-shanghai.aliyuncs.com/image/vite-scroll-bar-1.gif)

### 解决方案三、使用overflow: hidden配合事件监听实现滚动 + 虚拟滚动条

社区案例
- [perfectscrollbar](https://perfectscrollbar.com/)

方案注意点: 
1. 需要接管wheel、touch等事件，实现js滚动
2. 其他同上

参考资料
- [el-scrollbar](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar)