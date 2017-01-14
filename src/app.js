import request from 'al-request';
import { sleep } from './utils/utils';

if (__DEV__) {
  console.log('当前为开发环境');
}


export default class {
  async onLaunch() {
    try {
      await sleep(100);
      //await request('api/start');
    } catch (error) {
      console.error(error);
    }
  }


}
