export default {
  state: {
    moduleName: 'alarmRuleEdit',
    cid: null,
    bean: 'AlarmRuleEdit',
    routeName: 'AlarmRuleEdit',
    data: null
  },
  mutations: {
    alarmRuleEditSetCid(state, cid) {
      state.cid = cid;
    },
    alarmRuleEditSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    alarmRuleEditSetCid: ({commit}, payload) => {
      commit('alarmRuleEditSetCid', payload);
    },
    alarmRuleEditSetData: ({commit}, payload) => {
      commit('alarmRuleEditSetData', payload.data);
    }
  },
  getters: {}
};
