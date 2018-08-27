export default {
  state: {
    moduleName: 'alarmRuleEdit',
    bean: 'AlarmRuleEdit',
    routeName: 'AlarmRuleEdit',
    data: null
  },
  mutations: {
    alarmRuleEditSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    alarmRuleEditSetData: ({commit}, payload) => {
      commit('alarmRuleEditSetData', payload.data);
    }
  },
  getters: {}
};
