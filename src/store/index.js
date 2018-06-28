import Vue from 'vue';
import Vuex from 'vuex';
import authorization from './modules/authorization';
import monitorViewData from './modules/monitorViewData';
import monitorDict from './modules/monitorDict';
import * as ConstantUtils from './../assets/js/utils/constantUtils';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cid: 789,
    count: 1,
    modulesNames: ['monitorViewData']
  },
  // plugins: [createPersistedState()],
  mutations: {},
  actions: {
    fillModule: function ({commit, dispatch}, payload) {
      let event = payload.event;
      let data = event.data || event.response;
      if (data.length > 0) {
        let selfStore = payload.selfStore.state === undefined ?
          payload.selfStore[Object.keys(payload.selfStore)[0]] :
          payload.selfStore;
        let dataJson = JSON.parse(data);
        if (dataJson.method === 'ping') {
          let secondsInactive = (new Date().getTime() - JSON.parse(localStorage.getItem('lastActive'))) / 1000 / 60;
          if (secondsInactive > 15) {
            selfStore.logout();
          }
          return;
        }
        debugger;
        let respData = dataJson.data;
        let respError = dataJson.error;
        if (null !== respData) {
          let props = selfStore.state || selfStore[Object.keys(selfStore)[0]].state;
          for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
              let propObj = props[prop];
              if (propObj.hasOwnProperty('cid') || propObj.hasOwnProperty('bean')) {
                let moduleObj = props[prop];
                if ((null !== dataJson.cid && (moduleObj.cid === dataJson.cid)) || (null !== dataJson.bean) && (moduleObj.bean === dataJson.bean)) {
                  let actionName = moduleObj['moduleName'] + 'SetData';
                  dispatch(actionName, {'data': respData});
                }
              }
            }
          }
        } else if (null !== respError) {
          alert(respError.errorMsg);
        }
      }
    }
  },
  getters: {},
  modules: {
    authorization,
    monitorDict,
    monitorViewData
  }
});

export default store;
