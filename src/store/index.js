import Vue from 'vue';
import Vuex from 'vuex';
import monitorDict from './modules/monitorDict';
import monitorViewData from './modules/monitorViewData';
import alarmViewData from './modules/alarmViewData';
import objectViewData from './modules/objectViewData';
import monitorReestr from './modules/monitorReestr';
import monitorEdit from './modules/monitorEdit';
import alarmRuleReestr from './modules/alarmRuleReestr';
import alarmRuleEdit from './modules/alarmRuleEdit';
import * as funcUtils from "./../assets/js/utils/funcUtils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {

    modulesNames: ['monitorReestr', 'monitorEdit', 'alarmRuleReestr', 'alarmRuleEdit', 'monitorDict', 'monitorViewData', 'alarmViewData', 'objectViewData']
  },
  mutations: {},
  actions: {
    fillModule: function ({commit, dispatch}, payload) {
      let event = payload.event;
      let data = event.data || event.response;
      if (data.length > 0) {
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
        if (!funcUtils.isNull(respData)) {
          let props = this.state;
          for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
              let propObj = props[prop];
              if (propObj && !funcUtils.isNull(propObj) && (propObj.hasOwnProperty('cid') || propObj.hasOwnProperty('bean'))) {
                let moduleObj = props[prop];
                if ((!funcUtils.isNull(dataJson.cid) && (moduleObj.cid === dataJson.cid)) || !funcUtils.isNull(dataJson.bean) && (moduleObj.bean === dataJson.bean)) {
                  let actionName = moduleObj['moduleName'];
                  let command = respData.command;
                  let res;
                  if (funcUtils.isNotEmpty(command)) {
                    res = dataJson;
                    actionName += 'SetCommand';
                  } else {
                    res = respData;
                    actionName += 'SetData';
                  }
                  dispatch(actionName, {'data': res});
                }
              }
            }
          }
        } else if (!funcUtils.isNull(respError)) {
          alert(respError.errorMsg);
        }
      }
    }
  },
  getters: {},
  modules: {
    monitorReestr,
    monitorEdit,
    alarmRuleReestr,
    alarmRuleEdit,
    monitorDict,
    monitorViewData,
    alarmViewData,
    objectViewData
  }
});

export default store;
