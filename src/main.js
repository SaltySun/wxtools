import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import { UTable, UTableColumn } from 'umy-ui';
 
Vue.component(UTable.name, UTable);
Vue.component(UTableColumn.name, UTableColumn);

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,// 生产环境关闭，打开可在控制台查看socket连接和事件监听的信息
  options: {
    autoConnect: true //创建时是否自动连接，默认关，使用时用open开启链接
  },
  connection: SocketIO('http://localhost:5001/api/ws') //链接地址
}))

new Vue({
  sockets: {
    connecting() { console.log('正在连接') },
    connect() { console.log('连接成功') },
    disconnect() { console.log('断开连接') },
    connect_failed() { console.log('连接失败') },
    error() { console.log('错误发生，并且无法被其他事件类型所处理') },
    reconnecting() { console.log('正在重连') },
    reconnect_failed() { console.log('重连失败') },
    reconnect() { console.log('重连成功') },
    welcome: data => {//全局监听订阅事件，需要与后端约定好
      console.log('welcome data', data)
    }
  },
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
