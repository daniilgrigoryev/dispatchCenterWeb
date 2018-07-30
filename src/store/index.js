import Vue from 'vue';
import Vuex from 'vuex';
import monitorViewData from './modules/monitorViewData';
import monitorDict from './modules/monitorDict';
import * as funcUtils from "./../assets/js/utils/funcUtils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cid: null,
    modulesNames: ['monitorDict', 'monitorViewData']
  },
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
          let selfStorePing = payload.selfStore.$root;
          let secondsInactive = (new Date().getTime() - funcUtils.getfromLocalStorage('lastActive')) / 1000 / 60;
          if (secondsInactive > 15) {
            selfStorePing.logout();
          }
          return;
        }
        let respData = dataJson.data;
        let respError = dataJson.error;
        if (null !== respData) {
          let props = selfStore.state || selfStore[Object.keys(selfStore)[0]].state;
          for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
              let propObj = props[prop];
              if (propObj && null !== propObj && (propObj.hasOwnProperty('cid') || propObj.hasOwnProperty('bean'))) {
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
    monitorDict,
    monitorViewData
  }
});

export default store;
