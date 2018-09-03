export default {
  state: {
    moduleName: 'alarmRuleReestr',
    cid: null,
    bean: 'AlarmRuleReestr',
    routeName: 'AlarmRuleReestr',
    data: null
  },
  mutations: {
    alarmRuleReestrSetCid(state, cid) {
      state.cid = cid;
    },
    alarmRuleReestrSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    alarmRuleReestrSetCid: ({commit}, payload) => {
      commit('alarmRuleReestrSetCid', payload);
    },
    alarmRuleReestrSetData: ({commit}, payload) => {
      commit('alarmRuleReestrSetData', payload.data);
    }
  },
  getters: {}
};
