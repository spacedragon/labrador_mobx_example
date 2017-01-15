import { autorun, observable, action } from 'mobx';
import * as utils from 'labrador/utils';
import pick from 'lodash/pick';
// 我们所有的 store 都在这里
import stores from '../stores/index';

/**
 * 让小程序控件动起来的High Order Component (高阶控件)
 * 最后一个参数是 component , 前面的都是需要 inject 的store 名称
 */
export default function observer(...args) {
  let storeNames = args.slice();
  let component = storeNames.pop();

  // labrador 定义的2个lifecycle 函数
  let onLoad: Function = component.prototype.onLoad;
  let onUnload: Function = component.prototype.onUnload;

  // 开关,  onLoad的时候打开 ,  onUnLoad 的时候关闭
  let connected = observable(false);
  function onStateChange() { // 从 labrador-redux 中学来的函数
    if (this.onUpdate) {
      this.onUpdate();
      if (__DEV__) {
        // Development
        console.log('%c%s onUpdate(%o) Component:%o',
          'color:#2a8f99',
          this.id, utils.getDebugObject(this.props),
          this
        );
      }
    }
    this._update(); // 触发控件相关的更新, 在这个函数中会读取 那些 mobx observable
  }

  component.prototype.onLoad = function (...args1) { // 控件被加载
    // 在autorun onStateChange , autorun 会捕捉所有相关的observable
    // todo: autorun 会不会太糙?  用mobx.Reaction 是不是可以更精细控制?
    autorun(() => {
      if (connected.get()) {
        onStateChange.apply(this);
      }
    });
    action(() => connected.set(true))();     // 打开我们的开关 , 让组件动起来

    if (onLoad) {
      onLoad.apply(this, args1);
    }
  };

  component.prototype.onUnload = function () {
    if (connected.get()) {
      action(() => connected.set(false))();  //组件被卸载, 关闭
    }
    if (onUnload) {
      onUnload.call(this);
    }
  };

  // 或许应该在 OnShow OnHide 中加入开关 ,  因为页面隐藏的时候也没必要触发渲染


  let extend = function (cls) {
    function wrappedClass(props) {
      // 注入 store , 见 lodash 的pick 函数
      let propsWithStore = { ...props, ...pick(stores, ...storeNames) };
      cls.apply(this, [propsWithStore]);
    }
    wrappedClass.prototype = Object.create(cls.prototype);
    return wrappedClass;
  };

  return extend(component);
}
