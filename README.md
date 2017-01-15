## What
基于 [Labrador](https://github.com/maichong/labrador) 和 [mobx](https://mobx.js.org/index.html) 框架构建的小程序开发demo。

## Why 
Labrador 开发框架使微信开发回到我们熟悉的开发环境和流程中来 ,  更多特性请参考 [Labrador](https://github.com/maichong/labrador)
使用Mobx 来做状态管理相比 Redux 来说更简单易懂, 更自由,  代码更少.

## How  

```
	git clone https://github.com/spacedragon/labrador_mobx_example.git
	npm install
	npm run dev
```

## So ...
熟悉mobx 的看 hocs/observer.js  里面的注释

## Known Issues
1. Labrador 可能存在 [issue](https://github.com/maichong/labrador/issues/35)  所以目前package.json 里面使用的是我 fork 之后修改过的版本

2. 微信小程序的 Page.setData(data)  对data 做了一次拷贝, 但是拷贝出来的对象丢失了 getter 方法, 这使得在 xml/wxml 界面绑定的时候取不到 mobx computed value ,  目前的解决方法是为 store 写一个 toJS 序列化方法, 将 computed value 转化为普通的 property .  (同样需要修改 labrador 框架)
3. 目前使用mobx 2.7.0  , 目测 3.0.0  的版本在小程序环境中存在兼容性问题, 需要进一步研究.
4. mobx 有可能比  redux / saga  更占空间 ,  注意小程序有 1m 的限制.  (mobx.min.js 有51k肯定比 redux 大许多, 但是因为mobx 需要的业务逻辑代码更少, 也许在更大的项目中会有优势)



