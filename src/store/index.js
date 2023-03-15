import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    article_list: [],
    batch_bind_list: [],
    beifen_search: [],
    inv_list: [],
    socket: null,
    wxlist: [],
    datakey: {},
    status: { 0: '未登录', 1: '已登录', 2: '账号异常,登录失败', 3: '用户名/密码错误', 4: '请使用此公众号绑定的微信号', 5: '请重新验证微信号', 6: '账号冻结' }
  },
  getters: {
    wxlist(state) {
      return state.wxlist
    }
  },
  mutations: {
    ADD_TO_LOACL(state, res) {
      console.log(res)
      res.forEach((item, index) => {
        item.login_status = state.status[item.login_status]
        state.datakey[item.username] = index
      });
      state.wxlist = res
    },
    BATCH_LOGIN(state, res) {
      let newlist = state.wxlist
      res.data.data.login_status = state.status[res.data.data.login_status]
      if (res.data.data.type == 1) newlist[state.datakey[res.data.data.username]].type = '公众号'
      if (res.data.data.type == 2) newlist[state.datakey[res.data.data.username]].type = '小程序'
      newlist[state.datakey[res.data.data.username]].gzh_id = res.data.data.gzh_id
      newlist[state.datakey[res.data.data.username]].gzh_name = res.data.data.gzh_name
      newlist[state.datakey[res.data.data.username]].login_status = res.data.data.login_status
    },
    INVITE_BIND(state, res) {
      res.status == 1 ? res.status = '登陆成功' : res.status = '登陆失败'
      const type = state.inv_list.findIndex(item => item.gzh_id === res.gzh_id)
      if (type === -1) state.inv_list.push(res)
      state.beifen_search = state.inv_list
    },
    SEACRCH_INV(state, key) {
      console.log(key)
      if (key != '') {
        state.inv_list = state.inv_list.filter(item => item.gzh_name.indexOf(key) != -1)
      } else {
        state.inv_list = state.beifen_search
      }
    },
    START_BIND(state, data) {
      state.batch_bind_list = data
    },
    ADD_BIND(state, data) {
      const type = state.batch_bind_list.findIndex(item => item.gzh_name === data.gzh_name)
      if (type === -1) state.batch_bind_list.push(data)
    },
    ADD_ARTICLE(state, res) {
      state.article_list = state.article_list.concat(res)
    },
    DEL_ARTICLE(state, res) {
      let newlist =  state.article_list
      newlist.forEach((item, index) => {
        if (item.gzh_id == res.gzh_id && item.msgid == res.msgid && item.itemidx == res.itemidx) {
          item.publish_status = res.publish_status
          console.log(item)
        }
      })
      state.article_list = newlist
    }
  },
  actions: {
    ADD_LIST({ commit }, res) {
      commit('ADD_TO_LOACL', res)
    },
    batch_login({ commit }, res) {
      commit('BATCH_LOGIN', res)
    },
    inv_bind({ commit }, res) {
      commit('INVITE_BIND', res)
    },
    seach_inv({ commit }, key) {
      commit('SEACRCH_INV', key)
    },
    startbind({ commit }, data) {
      commit('START_BIND', data)
    },
    addbind({ commit }, res) {
      commit('ADD_BIND', res)
    },
    add_article({ commit }, res) {
      commit('ADD_ARTICLE', res)
    },
    del_article({ commit }, res) {
      commit('DEL_ARTICLE', res)
    }
  },
  modules: {

  }
})
