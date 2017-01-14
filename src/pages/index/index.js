import wx, { Component } from 'labrador';
import observer from '../../hocs/observer';
import Todo from '../../components/todo/todo';
import { sleep } from '../../utils/utils';

class Index extends Component {

  constructor(props) {
    super(props);
    this.store = props.todoStore;
    console.log(this.store);
  }

  state = {
    titleInput: ''
  };

  children() {
    return {
      unfinished: this.store.unfinished.map((todo) => ({
        component: Todo,
        key: todo.id,
        props: {
          ...todo,
          onRemove: this.handleRemove,
          onRestore: this.handleRestore,
          onFinish: this.handleFinish
        }
      })),
      finished: this.store.finished.map((todo) => ({
        component: Todo,
        key: todo.id,
        props: {
          ...todo,
          onRemove: this.handleRemove,
          onRestore: this.handleRestore,
          onFinish: this.handleFinish
        }
      }))
    };
  }

  onUpdate() {
    let nextState = {
      finished: this.store.finished.length
    };

    this.setState(nextState);
  }

  async onPullDownRefresh() {
    await sleep(1000);
    wx.showToast({ title: '刷新成功' });
    wx.stopPullDownRefresh();
  }

  handleCreate() {
    let title = this.state.titleInput;
    if (!title) {
      wx.showToast({ title: '请输入任务' });
      return;
    }
    this.store.create(title);
    this.setState({ titleInput: '' });
  }

  handleInput(e) {
    this.setState({ titleInput: e.detail.value });
  }

  handleRemove = (id) => {
    this.store.remove(id);
  };

  handleFinish = (id) => {
    this.store.finish(id);
  };

  handleRestore = (id) => {
    this.store.restore(id);
  };

}

export default observer('todoStore', Index);
