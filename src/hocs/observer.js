import { autorun, observable, action } from 'mobx';
import * as utils from 'labrador/utils';
import pick from 'lodash/pick';
import stores from '../stores/index';

export default function observer(...args) {
  let storeNames = args.slice();
  let component = storeNames.pop();

  let onLoad: Function = component.prototype.onLoad;
  let onUnload: Function = component.prototype.onUnload;
  let connected = observable(false);
  function onStateChange() {
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
    this._update();
  }

  component.prototype.onLoad = function (...args1) {
    autorun(() => {
      if (connected.get()) {
        onStateChange.apply(this);
      }
    });
    action(() => connected.set(true))();
    if (onLoad) {
      onLoad.apply(this, args1);
    }
  };

  component.prototype.onUnload = function () {
    if (connected) {
      action(() => connected.set(false))();
    }
    if (onUnload) {
      onUnload.call(this);
    }
  };

  let extend = function (cls) {
    function wrappedClass(props) {
       // 注入 store
      let propsWithStore = { ...props, ...pick(stores, ...storeNames) };
      cls.apply(this, [propsWithStore]);
    }
    wrappedClass.prototype = Object.create(cls.prototype);
    return wrappedClass;
  };

  return extend(component);
}
